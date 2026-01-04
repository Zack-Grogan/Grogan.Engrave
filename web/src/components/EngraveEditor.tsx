'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';

/**
 * Robust, responsive editor that treats the Product Image as the coordinate system.
 * The zone and user content are positioned relative to the Product Image, 
 * ensuring perfect alignment regardless of screen size.
 */
interface EngraveEditorProps {
    productImage: string;
    // We don't use the physical 'engravingZone' inches for rendering, only for export metadata if needed.
    // The visual placement is 100% determined by canvasConfig.
    canvasConfig: {
        scale: number;      // Target scale of image relative to canvas (0.9 = 90% fit)
        zoneLeft: number;   // % of Image Width (50 = center)
        zoneTop: number;    // % of Image Height (50 = center)
        zoneWidth: number;  // % of Image Width
        zoneHeight: number; // % of Image Height
    };
    onExportSVG: (svg: string) => void;
    onDesignChange?: (hasContent: boolean) => void;
}

interface EditorState {
    currentFont: string;
    fontSize: number;
    textAlign: 'left' | 'center' | 'right';
}

const FONTS = [
    { id: 'Arial', name: 'Arial' },
    { id: 'Georgia', name: 'Georgia' },
    { id: 'Times New Roman', name: 'Times' },
    { id: 'Courier New', name: 'Courier' },
    { id: 'Verdana', name: 'Verdana' },
    { id: 'Impact', name: 'Impact' },
];

export default function EngraveEditor({
    productImage,
    canvasConfig,
    onExportSVG,
    onDesignChange,
}: EngraveEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);

    // References to core objects for easy access
    const imageRef = useRef<fabric.FabricImage | null>(null);
    const zoneRef = useRef<fabric.Rect | null>(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [editorState, setEditorState] = useState<EditorState>({
        currentFont: 'Arial',
        fontSize: 32,
        textAlign: 'center',
    });
    const [selectedObject, setSelectedObject] = useState<boolean>(false);
    const [canUndo, setCanUndo] = useState(false);

    // History for Undo
    const historyRef = useRef<string[]>([]);
    const historyIndexRef = useRef(-1);

    // -------------------------------------------------------------------------
    // Helper: Position Elements
    // Repositions the image and zone based on current canvas dimensions.
    // This is called on Init and on Resize.
    // -------------------------------------------------------------------------
    const positionElements = useCallback(() => {
        const canvas = fabricRef.current;
        const img = imageRef.current;
        const zone = zoneRef.current;
        const container = containerRef.current;

        if (!canvas || !img || !zone || !container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        // 1. Resize Canvas to Match Container
        canvas.setDimensions({ width, height });

        // 2. Scale & Center Image
        // Calculate scale to fit within current view, multiplying by the config scale (spacing)
        const scaleX = width / (img.width || 1);
        const scaleY = height / (img.height || 1);
        const minScale = Math.min(scaleX, scaleY);
        const finalScale = minScale * (canvasConfig.scale || 0.9);

        img.set({
            scaleX: finalScale,
            scaleY: finalScale,
            left: width / 2,
            top: height / 2,
            originX: 'center',
            originY: 'center',
        });
        img.setCoords();

        // 3. Position Zone Relative to Image
        // All config percentages are relative to the Image's *Scaled* Dimensions
        const effectiveImgWidth = (img.width || 0) * finalScale;
        const effectiveImgHeight = (img.height || 0) * finalScale;

        // Calculate Zone dimensions (percentage of image)
        const zWidth = effectiveImgWidth * (canvasConfig.zoneWidth / 100);
        const zHeight = effectiveImgHeight * (canvasConfig.zoneHeight / 100);

        // Calculate Zone center position
        // offset from image center. config.zoneLeft=50 means 0 offset.
        const leftOffset = effectiveImgWidth * ((canvasConfig.zoneLeft - 50) / 100);
        const topOffset = effectiveImgHeight * ((canvasConfig.zoneTop - 50) / 100);

        zone.set({
            width: zWidth,
            height: zHeight,
            left: (width / 2) + leftOffset,
            top: (height / 2) + topOffset,
            originX: 'center',
            originY: 'center',
        });
        zone.setCoords();

        canvas.requestRenderAll();

    }, [canvasConfig]);

    // -------------------------------------------------------------------------
    // Init Fabric JS
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        // Create Canvas
        const canvas = new fabric.Canvas(canvasRef.current, {
            preserveObjectStacking: true,
            selection: true,
            controlsAboveOverlay: true,
            centeredScaling: true,
            backgroundColor: '#0f0f0f', // Dark background for contrast
        });
        fabricRef.current = canvas;

        // Load Image
        fabric.FabricImage.fromURL(productImage, { crossOrigin: 'anonymous' }).then((img) => {
            if (!fabricRef.current) return; // Component unmounted

            img.set({
                selectable: false,
                evented: false,
                opacity: 1,
            });
            (img as any).name = 'productImage';
            imageRef.current = img;
            canvas.add(img);

            // Create Zone
            const zone = new fabric.Rect({
                fill: 'rgba(201, 169, 98, 0.15)', // Gold tint
                stroke: '#c9a962',
                strokeWidth: 2,
                strokeDashArray: [10, 5],
                rx: 4, // Rounded corners
                ry: 4,
                selectable: false,
                evented: false,
            });
            (zone as any).name = 'engravingZone';
            zoneRef.current = zone;
            canvas.add(zone);

            // Initial Layout
            positionElements();
            setIsLoaded(true);

            // Save initial state for history
            saveHistory();
        });

        // Event Listeners
        const handleSelection = () => {
            setSelectedObject(!!canvas.getActiveObject());
        };

        const handleModification = () => {
            checkBounds();
            saveHistory();
            onDesignChange?.(hasDesignContent());
        };

        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);
        canvas.on('selection:cleared', handleSelection);
        canvas.on('object:modified', handleModification);
        // Also check bounds while moving
        canvas.on('object:moving', () => checkBounds());
        canvas.on('object:scaling', () => checkBounds());

        // Resize Observer
        const resizeObserver = new ResizeObserver(() => {
            // Debounce or just run? Run is fine for now.
            window.requestAnimationFrame(positionElements);
        });
        resizeObserver.observe(containerRef.current);

        // Cleanup
        return () => {
            resizeObserver.disconnect();

            // Critical: dispose to prevent memory leaks and "crashes on switch"
            canvas.dispose();
            fabricRef.current = null;
            imageRef.current = null;
            zoneRef.current = null;
        };
    }, [productImage, canvasConfig, positionElements]); // Re-run if image or config changes

    // -------------------------------------------------------------------------
    // Editor Actions
    // -------------------------------------------------------------------------
    const checkBounds = () => {
        const canvas = fabricRef.current;
        const zone = zoneRef.current;
        if (!canvas || !zone) return;

        // Simple bounding box check
        const zoneRect = zone.getBoundingRect();

        canvas.getObjects().forEach((obj) => {
            if ((obj as any).name === 'productImage' || (obj as any).name === 'engravingZone') return;

            const objRect = obj.getBoundingRect();

            // Check if outside (roughly)
            const isOutside =
                objRect.left < zoneRect.left ||
                objRect.top < zoneRect.top ||
                (objRect.left + objRect.width) > (zoneRect.left + zoneRect.width) ||
                (objRect.top + objRect.height) > (zoneRect.top + zoneRect.height);

            if (isOutside) {
                obj.set({ stroke: 'red', strokeWidth: 2 });
            } else {
                obj.set({ stroke: null, strokeWidth: 0 });
            }
        });
        canvas.requestRenderAll();
    };

    const saveHistory = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        // Limit history to 10 steps to save memory
        const json = JSON.stringify(canvas.toJSON());
        const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
        newHistory.push(json);
        if (newHistory.length > 20) newHistory.shift();
        historyRef.current = newHistory;
        historyIndexRef.current = newHistory.length - 1;
        setCanUndo(historyIndexRef.current > 0);
    };

    const hasDesignContent = () => {
        return (fabricRef.current?.getObjects().length || 0) > 2; // > image + zone
    };

    const addText = () => {
        const canvas = fabricRef.current;
        const zone = zoneRef.current;
        if (!canvas || !zone) return;

        const text = new fabric.FabricText('Your Text', {
            fontFamily: editorState.currentFont,
            fontSize: 40 * (imageRef.current?.scaleX || 1), // Scale font relative to image size
            fill: '#c9a962',
            textAlign: 'center',
            left: zone.left, // Center in ZONE
            top: zone.top,
            originX: 'center',
            originY: 'center',
        });
        (text as any).name = 'userText';
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.requestRenderAll();
        saveHistory();
        onDesignChange?.(true);
    };

    const deleteSelected = () => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
            canvas.remove(active);
            canvas.requestRenderAll();
            saveHistory();
            onDesignChange?.(hasDesignContent());
            setSelectedObject(false);
        }
    };

    const undo = () => {
        if (historyIndexRef.current <= 0) return;
        const canvas = fabricRef.current;
        if (!canvas) return;

        historyIndexRef.current--;
        const json = historyRef.current[historyIndexRef.current];
        canvas.loadFromJSON(JSON.parse(json)).then(() => {
            // Re-assign references after load? No, IDs might be lost.
            // Actually dangerous. Better to just restore user objects specifically? 
            // For MVP, full restore is fine, but we must re-grab references if we need them.
            // Luckily positionElements grabs by ref.current which might be stale? 
            // fabric.loadFromJSON replaces objects.

            // Re-find image and zone
            const objects = canvas.getObjects();
            const img = objects.find(o => (o as any).name === 'productImage');
            const zone = objects.find(o => (o as any).name === 'engravingZone');

            if (img) imageRef.current = img as fabric.FabricImage;
            if (zone) zoneRef.current = zone as fabric.Rect;

            canvas.requestRenderAll();
            onDesignChange?.(hasDesignContent());
            setCanUndo(historyIndexRef.current > 0);
        });
    };

    // Expo for parent
    useEffect(() => {
        (window as any).__exportEngraveDesign = () => fabricRef.current?.toSVG();
        return () => { delete (window as any).__exportEngraveDesign; };
    }, []);

    return (
        <div className="flex flex-col h-full w-full relative bg-[#0f0f0f]">
            {/* 1. Canvas Area */}
            <div className="flex-1 relative overflow-hidden" ref={containerRef}>
                <canvas ref={canvasRef} />
            </div>

            {/* 2. Floating Toolbar (Strictly outside canvas flow, absolutely positioned at bottom) */}
            <div className="absolute left-0 right-0 bottom-0 p-4 z-10 pointer-events-none flex justify-center">
                <div className="bg-surface/95 backdrop-blur shadow-2xl rounded-2xl p-2 border border-white/10 pointer-events-auto min-w-[300px] max-w-full overflow-x-auto custom-scrollbar">
                    <div className="flex items-center gap-3">
                        {/* Always Valid Actions */}
                        <div className="flex items-center gap-2 pr-3 border-r border-white/10">
                            <button onClick={addText} className="bg-accent text-background px-4 py-2 rounded-xl font-bold hover:brightness-110 active:scale-95 transition whitespace-nowrap">
                                + Text
                            </button>
                            <label className="bg-surface-alt text-text-primary px-3 py-2 rounded-xl border border-white/10 font-medium cursor-pointer hover:bg-white/5 whitespace-nowrap">
                                + Img
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    /* Image Handler implementation similar to previous but simpler */
                                    const file = e.target.files?.[0];
                                    if (file && fabricRef.current && zoneRef.current) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            fabric.FabricImage.fromURL(ev.target?.result as string).then(img => {
                                                const zone = zoneRef.current!;
                                                const scale = Math.min(zone.width! / img.width!, zone.height! / img.height!) * 0.8;
                                                img.set({
                                                    left: zone.left, top: zone.top,
                                                    originX: 'center', originY: 'center',
                                                    scaleX: scale, scaleY: scale
                                                });
                                                fabricRef.current?.add(img);
                                                fabricRef.current?.setActiveObject(img);
                                                saveHistory();
                                                onDesignChange?.(true);
                                            });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                        </div>

                        {/* Formatting (Conditional) */}
                        {selectedObject ? (
                            <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
                                <button onClick={deleteSelected} className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/30">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                                {/* Simple Font Toggle for MVP */}
                                <button onClick={() => {
                                    const active = fabricRef.current?.getActiveObject();
                                    if (active && active.type === 'text') {
                                        const nextFont = FONTS[(FONTS.findIndex(f => f.id === editorState.currentFont) + 1) % FONTS.length].id;
                                        (active as fabric.FabricText).set('fontFamily', nextFont);
                                        setEditorState(s => ({ ...s, currentFont: nextFont }));
                                        fabricRef.current?.requestRenderAll();
                                    }
                                }} className="bg-surface-alt px-3 py-2 rounded-lg text-sm border border-white/10 min-w-[60px]">
                                    {editorState.currentFont}
                                </button>
                            </div>
                        ) : (
                            <div className="text-xs text-text-muted italic px-2">Select an item to edit</div>
                        )}

                        {/* Undo */}
                        <div className="ml-auto pl-3 border-l border-white/10">
                            <button onClick={undo} disabled={!canUndo} className="p-2 text-text-muted hover:text-white disabled:opacity-30">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
