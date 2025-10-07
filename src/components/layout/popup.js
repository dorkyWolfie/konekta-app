'use client';
import { useEffect } from 'react';

export default function PopUp({ children }) {
  useEffect(() => {
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';

    // Cleanup: restore scroll when popup closes
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-10 max-w-xl w-full relative m-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}