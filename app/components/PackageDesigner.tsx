import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface PackageItem {
  id: string | number;
  src: string;
  alt: string;
}

interface DraggableItem extends PackageItem {
  position: { x: number; y: number };
  scale: number;
  brightness: number;
  contrast: number;
  removeBackground: boolean;
  rotation: number; // Added rotation property
}

const PackageDesigner: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [placedItems, setPlacedItems] = useState<DraggableItem[]>([]);
  const [customIcons, setCustomIcons] = useState<PackageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'packages' | 'icons' | 'logos'>('packages');
  const previewRef = useRef<HTMLDivElement>(null);
  const dragItemRef = useRef<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Package options
  const packages: PackageItem[] = Array.from({ length: 9 }, (_, i) => ({
    id: (i + 1).toString(),
    src: `/icons/packages/package${i + 1}.png`,
    alt: `Package ${i + 1}`
  }));

  const logos: PackageItem[] = Array.from({ length: 8 }, (_, i) => ({
    id: (i + 1).toString(),
    src: `/icons/Logos/logo${i + 1}.png`,
    alt: `Logo ${i + 1}`
  }));

  const defaultIcons: PackageItem[] = Array.from({ length: 35 }, (_, i) => ({
    id: (i + 1).toString(),
    src: `/icons/decorative/${i + 1}.png`,
    alt: `Icon ${i + 1}`
  }));

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent, item: DraggableItem) => {
    if (!previewRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    dragItemRef.current = item.id.toString();
    
    const touch = e.touches[0];
    const rect = previewRef.current.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left - item.position.x;
    const offsetY = touch.clientY - rect.top - item.position.y;
    setDragOffset({ x: offsetX, y: offsetY });
    setSelectedItem(item.id.toString());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!previewRef.current || !dragItemRef.current || !isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = previewRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - dragOffset.x;
    const y = touch.clientY - rect.top - dragOffset.y;

    setPlacedItems(items =>
      items.map(item =>
        item.id.toString() === dragItemRef.current
          ? { ...item, position: { x, y } }
          : item
      )
    );
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    dragItemRef.current = null;
  };

  // Mouse event handlers (kept for desktop compatibility)
  const handleMouseDown = (e: React.MouseEvent, item: DraggableItem) => {
    if (!previewRef.current) return;
    setIsDragging(true);
    dragItemRef.current = item.id.toString();
    const rect = previewRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - item.position.x;
    const offsetY = e.clientY - rect.top - item.position.y;
    setDragOffset({ x: offsetX, y: offsetY });
    setSelectedItem(item.id.toString());
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!previewRef.current || !dragItemRef.current || !isDragging) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setPlacedItems(items =>
      items.map(item =>
        item.id.toString() === dragItemRef.current
          ? { ...item, position: { x, y } }
          : item
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragItemRef.current = null;
  };

  const handleItemAdd = (item: PackageItem) => {
    // Calculate center position based on preview size
    let centerX = 50;
    let centerY = 50;
    
    if (previewRef.current) {
      const rect = previewRef.current.getBoundingClientRect();
      centerX = rect.width / 2 - 16; // 16 is half of item width (32px)
      centerY = rect.height / 2 - 16; // 16 is half of item height (32px)
    }
    
    const newItem: DraggableItem = {
      ...item,
      id: `${item.id}-${Date.now()}`,
      position: { x: centerX, y: centerY },
      scale: 0.5,
      brightness: 100,
      contrast: 100,
      removeBackground: false,
      rotation: 0 // Initialize rotation to 0 degrees
    };
    setPlacedItems(prev => [...prev, newItem]);
    setSelectedItem(newItem.id.toString());
  };

  // Render mobile layout
  if (isMobile) {
    return (
      <div className="w-full bg-pink-50 pb-16">
        <h2 className="font-bold text-pink-500 text-center py-2 text-2xl">
          ✨ Design Your Wonder Package ✨
        </h2>
        
        <div className="flex flex-col px-2">
          {/* Main content area with preview and adjustment controls side by side */}
          <div className="flex flex-row mb-2">
            {/* Preview Section */}
            <div className="w-3/5 pr-1">
              <div 
                ref={previewRef}
                className="relative bg-white rounded-lg border-2 border-pink-200 aspect-square w-full"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {selectedPackage ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={selectedPackage.src} 
                      alt={selectedPackage.alt}
                      className="w-full h-full object-contain"
                    />
                    {placedItems.map((item) => (
                      <div
                        key={item.id}
                        className={`absolute cursor-move ${selectedItem === item.id.toString() ? 'ring-2 ring-pink-500' : ''}`}
                        style={{
                          left: `${item.position.x}px`,
                          top: `${item.position.y}px`,
                          transform: `scale(${item.scale}) rotate(${item.rotation}deg)`, // Added rotation
                          zIndex: isDragging && dragItemRef.current === item.id.toString() ? 10 : 1
                        }}
                        onMouseDown={(e) => handleMouseDown(e, item)}
                        onTouchStart={(e) => handleTouchStart(e, item)}
                      >
                        <img 
                          src={item.src}
                          alt={item.alt}
                          className="w-12 h-12 object-contain"
                          style={{
                            filter: `brightness(${item.brightness}%) contrast(${item.contrast}%)`,
                            backgroundColor: item.removeBackground ? 'transparent' : 'initial',
                            mixBlendMode: item.removeBackground ? 'multiply' : 'normal',
                            WebkitMaskImage: item.removeBackground ? 'linear-gradient(to bottom, black, black)' : 'none',
                          }}
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-pink-500 text-center p-4">
                      Please select a package below to start designing
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Item Controls - Only show when item is selected */}
            <div className="w-2/5 pl-1">
              {selectedItem ? (
                <div className="bg-white p-2 rounded-lg border-2 border-pink-200 h-full">
                  <h3 className="text-lg font-bold text-pink-500 mb-2">Adjust Item</h3>
                  <div className="space-y-2">
                    {/* Size Controls */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPlacedItems(items =>
                          items.map(item =>
                            item.id.toString() === selectedItem
                              ? { ...item, scale: Math.max(0.2, item.scale - 0.1) }
                              : item
                          )
                        )}
                        className="flex-1 px-2 py-1 bg-pink-500 text-white rounded-lg text-sm"
                      >
                        Smaller
                      </button>
                      <button
                        onClick={() => setPlacedItems(items =>
                          items.map(item =>
                            item.id.toString() === selectedItem
                              ? { ...item, scale: Math.min(3, item.scale + 0.1) }
                              : item
                          )
                        )}
                        className="flex-1 px-2 py-1 bg-pink-500 text-white rounded-lg text-sm"
                      >
                        Larger
                      </button>
                    </div>
                    
                    {/* Rotation Controls - ADDED */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPlacedItems(items =>
                          items.map(item =>
                            item.id.toString() === selectedItem
                              ? { ...item, rotation: (item.rotation - 15) % 360 }
                              : item
                          )
                        )}
                        className="flex-1 px-2 py-1 bg-pink-500 text-white rounded-lg text-sm"
                      >
                        ↶ Rotate
                      </button>
                      <button
                        onClick={() => setPlacedItems(items =>
                          items.map(item =>
                            item.id.toString() === selectedItem
                              ? { ...item, rotation: (item.rotation + 15) % 360 }
                              : item
                          )
                        )}
                        className="flex-1 px-2 py-1 bg-pink-500 text-white rounded-lg text-sm"
                      >
                        ↷ Rotate
                      </button>
                    </div>
                    
                    {/* Background Removal Toggle */}
                    <button
                      onClick={() => setPlacedItems(items =>
                        items.map(item =>
                          item.id.toString() === selectedItem
                            ? { ...item, removeBackground: !item.removeBackground }
                            : item
                        )
                      )}
                      className="w-full px-2 py-1 bg-pink-500 text-white rounded-lg text-sm"
                    >
                      {placedItems.find(item => item.id.toString() === selectedItem)?.removeBackground 
                        ? "Restore Bg" 
                        : "Remove Bg"}
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => {
                        setPlacedItems(items => items.filter(item => item.id.toString() !== selectedItem));
                        setSelectedItem(null);
                      }}
                      className="w-full px-2 py-1 bg-red-500 text-white rounded-lg text-sm"
                    >
                      Remove Item
                    </button>
                    
                    {/* Submit Button */}
                    <button
                      onClick={() => {
                        if (!selectedPackage) {
                          alert('Please select a package first!');
                          return;
                        }
                        console.log('Design submitted:', {
                          package: selectedPackage,
                          placedItems
                        });
                      }}
                      className="w-full px-2 py-1 bg-pink-500 text-white rounded-lg text-sm font-bold"
                    >
                      Submit Design
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-2 rounded-lg border-2 border-pink-200 h-full flex items-center justify-center">
                  <p className="text-pink-400 text-center text-sm">
                    Tap on an item to adjust it
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation for bottom panels */}
          <div className="flex border-b border-pink-200 bg-white rounded-t-lg">
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'packages' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-pink-300'}`}
              onClick={() => setActiveTab('packages')}
            >
              Packages
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'icons' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-pink-300'}`}
              onClick={() => setActiveTab('icons')}
            >
              Icons
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium ${activeTab === 'logos' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-pink-300'}`}
              onClick={() => setActiveTab('logos')}
            >
              Logos
            </button>
          </div>

          {/* Content for each tab */}
          <div className="bg-white rounded-b-lg border-2 border-t-0 border-pink-200 p-2">
            {activeTab === 'packages' && (
              <div>
                <div className="grid grid-cols-5 gap-1">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-1 border rounded-lg hover:border-pink-500 transition-all aspect-square ${
                        selectedPackage?.id === pkg.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <img src={pkg.src} alt={pkg.alt} className="w-full h-full object-contain" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'icons' && (
              <div>
                <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
                  {[...defaultIcons, ...customIcons].map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => handleItemAdd(icon)}
                      className="p-1 border border-gray-200 rounded-lg hover:border-pink-500 transition-all aspect-square"
                    >
                      <div className="relative w-full h-full">
                        <img src={icon.src} alt={icon.alt} className="w-full h-full object-contain" />
                      </div>
                    </button>
                  ))}
                </div>
                <label 
                  htmlFor="icon-upload"
                  className="mt-2 w-full px-2 py-1 bg-pink-500 text-white rounded-lg cursor-pointer hover:bg-pink-600 block text-center text-sm"
                >
                  Upload Icon
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    e.preventDefault();
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const file = files[0];
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target && event.target.result) {
                          const newIcon = {
                            id: `custom-${Date.now()}`,
                            src: event.target.result as string,
                            alt: `Custom Icon ${customIcons.length + 1}`
                          };
                          setCustomIcons(prev => [...prev, newIcon]);
                          handleItemAdd(newIcon);
                          
                          // Reset the input value to allow uploading the same file again
                          e.target.value = '';
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="icon-upload"
                />
              </div>
            )}

            {activeTab === 'logos' && (
              <div>
                <div className="grid grid-cols-4 gap-1">
                  {logos.map((logo) => (
                    <button
                      key={logo.id}
                      onClick={() => handleItemAdd(logo)}
                      className="p-1 border border-gray-200 rounded-lg hover:border-pink-500 transition-all aspect-square"
                    >
                      <div className="relative w-full h-full">
                        <img src={logo.src} alt={logo.alt} className="w-full h-full object-contain" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render desktop layout (your original layout with minor improvements)
  return (
    <div className="w-full min-h-screen bg-white p-4">
      <h2 className="font-bold text-pink-500 text-center mb-4 text-4xl">
        ✨ Design Your Wonder Package ✨
      </h2>
      
      <div className="grid grid-cols-12 gap-4">
        {/* Decorative Icons - Left on desktop */}
        <div className="col-span-2 bg-white p-4 rounded-lg border-2 border-pink-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-pink-500">Decorative Icons</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto p-2 bg-gray-50 rounded-lg">
            {[...defaultIcons, ...customIcons].map((icon) => (
              <button
                key={icon.id}
                onClick={() => handleItemAdd(icon)}
                className="p-1 border-2 border-gray-200 rounded-lg hover:border-pink-500 transition-all aspect-square"
              >
                <div className="relative w-full h-full">
                  <img 
                    src={icon.src} 
                    alt={icon.alt} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </button>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              e.preventDefault();
              const files = e.target.files;
              if (files && files.length > 0) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target && event.target.result) {
                    const newIcon = {
                      id: `custom-${Date.now()}`,
                      src: event.target.result as string,
                      alt: `Custom Icon ${customIcons.length + 1}`
                    };
                    setCustomIcons(prev => [...prev, newIcon]);
                    handleItemAdd(newIcon);
                    
                    // Reset the input value to allow uploading the same file again
                    e.target.value = '';
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
            id="icon-upload-desktop"
          />
          <label 
            htmlFor="icon-upload-desktop"
            className="mt-4 w-full px-4 py-2 bg-pink-500 text-white rounded-lg cursor-pointer hover:bg-pink-600 block text-center"
          >
            Upload Icon
          </label>
        </div>

        {/* Preview Section - Center */}
        <div className="col-span-7">
          <div 
            ref={previewRef}
            className="relative bg-white rounded-lg p-4 border-2 border-pink-200 aspect-square w-full max-w-[600px] mx-auto"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {selectedPackage ? (
              <div className="relative w-full h-full">
                <img 
                  src={selectedPackage.src} 
                  alt={selectedPackage.alt}
                  className="w-full h-full object-contain"
                />
                {placedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`absolute cursor-move ${selectedItem === item.id.toString() ? 'ring-2 ring-pink-500' : ''}`}
                    style={{
                      left: `${item.position.x}px`,
                      top: `${item.position.y}px`,
                      transform: `scale(${item.scale}) rotate(${item.rotation}deg)`, // Added rotation
                      zIndex: isDragging && dragItemRef.current === item.id.toString() ? 10 : 1
                    }}
                    onMouseDown={(e) => handleMouseDown(e, item)}
                    onTouchStart={(e) => handleTouchStart(e, item)}
                  >
                    <img 
                      src={item.src}
                      alt={item.alt}
                      className="w-16 h-16 object-contain"
                      style={{
                        filter: `brightness(${item.brightness}%) contrast(${item.contrast}%)`,
                        backgroundColor: item.removeBackground ? 'transparent' : 'initial',
                        mixBlendMode: item.removeBackground ? 'multiply' : 'normal',
                        WebkitMaskImage: item.removeBackground ? 'linear-gradient(to bottom, black, black)' : 'none',
                      }}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-pink-500 text-lg">
                  Please select a package to start designing
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Controls Section - Right on desktop */}
        <div className="col-span-3 space-y-4">
          {/* Package Selection */}
          <div className="bg-white p-4 rounded-lg border-2 border-pink-200">
            <h3 className="text-xl font-bold text-pink-500 mb-4">Choose Package</h3>
            <div className="grid grid-cols-3 gap-2">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-2 border-2 rounded-lg hover:border-pink-500 transition-all aspect-square ${
                    selectedPackage?.id === pkg.id ? 'border-pink-500' : 'border-gray-200'
                  }`}
                >
                  <img src={pkg.src} alt={pkg.alt} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Logos Section */}
          <div className="bg-white p-4 rounded-lg border-2 border-pink-200">
            <h3 className="text-xl font-bold text-pink-500 mb-4">Logos</h3>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
              {logos.map((logo) => (
                <button
                  key={logo.id}
                  onClick={() => handleItemAdd(logo)}
                  className="p-1 border-2 border-gray-200 rounded-lg hover:border-pink-500 transition-all aspect-square"
                >
                  <img src={logo.src} alt={logo.alt} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Item Controls - Only show when item is selected */}
          {selectedItem && (
            <div className="bg-white p-4 rounded-lg border-2 border-pink-200">
              <h3 className="text-xl font-bold text-pink-500 mb-4">Adjust Item</h3>
              <div className="space-y-4">
                {/* Size Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlacedItems(items =>
                      items.map(item =>
                        item.id.toString() === selectedItem
                          ? { ...item, scale: Math.max(0.2, item.scale - 0.1) }
                          : item
                      )
                    )}
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg"
                  >
                    Smaller
                  </button>
                  <button
                    onClick={() => setPlacedItems(items =>
                      items.map(item =>
                        item.id.toString() === selectedItem
                          ? { ...item, scale: Math.min(3, item.scale + 0.1) }
                          : item
                      )
                    )}
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg"
                  >
                    Larger
                  </button>
                </div>

                {/* Rotation Controls - ADDED */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlacedItems(items =>
                      items.map(item =>
                        item.id.toString() === selectedItem
                          ? { ...item, rotation: (item.rotation - 15) % 360 }
                          : item
                      )
                    )}
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg"
                  >
                    ↶ Rotate Left
                  </button>
                  <button
                    onClick={() => setPlacedItems(items =>
                      items.map(item =>
                        item.id.toString() === selectedItem
                          ? { ...item, rotation: (item.rotation + 15) % 360 }
                          : item
                      )
                    )}
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg"
                  >
                    ↷ Rotate Right
                  </button>
                </div>

                {/* Background Removal Toggle */}
                <button
                  onClick={() => setPlacedItems(items =>
                    items.map(item =>
                      item.id.toString() === selectedItem
                        ? { ...item, removeBackground: !item.removeBackground }
                        : item
                    )
                  )}
                  className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg"
                >
                  {placedItems.find(item => item.id.toString() === selectedItem)?.removeBackground 
                    ? "Restore Background" 
                    : "Remove Background"}
                </button>

                {/* Remove Button */}
                <button
                  onClick={() => {
                    setPlacedItems(items => items.filter(item => item.id.toString() !== selectedItem));
                    setSelectedItem(null);
                  }}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Remove Item
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={() => {
              if (!selectedPackage) {
                alert('Please select a package first!');
                return;
              }
              console.log('Design submitted:', {
                package: selectedPackage,
                placedItems
              });
            }}
            className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg text-lg font-bold"
          >
            Submit Design
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDesigner;