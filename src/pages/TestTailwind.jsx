import React from 'react';

const TestTailwind = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8">
          🎨 Tailwind CSS Test
        </h1>

        {/* Test Colors */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Colors Test</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              Primary
            </div>
            <div className="h-20 bg-secondary rounded-lg flex items-center justify-center text-white font-bold">
              Secondary
            </div>
            <div className="h-20 bg-accent rounded-lg flex items-center justify-center text-gray-900 font-bold">
              Accent
            </div>
          </div>
        </div>

        {/* Test Custom Classes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Custom Classes Test</h2>
          <div className="glass-effect p-6 rounded-xl mb-4">
            <p className="text-lg">Glass Effect Working ✓</p>
          </div>
          <div className="bg-primary shadow-neon p-6 rounded-xl mb-4">
            <p className="text-white text-lg">Neon Shadow Working ✓</p>
          </div>
          <h3 className="text-3xl logo-text-shadow text-primary">
            Logo Text Shadow Working ✓
          </h3>
        </div>

        {/* Test Responsive */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Responsive Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-20 bg-green-500 rounded-lg flex items-center justify-center text-white">
              Col 1
            </div>
            <div className="h-20 bg-green-600 rounded-lg flex items-center justify-center text-white">
              Col 2
            </div>
            <div className="h-20 bg-green-700 rounded-lg flex items-center justify-center text-white">
              Col 3
            </div>
            <div className="h-20 bg-green-800 rounded-lg flex items-center justify-center text-white">
              Col 4
            </div>
          </div>
        </div>

        {/* Test Typography */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Typography Test</h2>
          <p className="font-display text-lg mb-2">Font Display (Montserrat) ✓</p>
          <p className="font-body text-base mb-2">Font Body (Montserrat) ✓</p>
          <p className="text-sm text-gray-600">
            If you can see styled content above, Tailwind CSS is working correctly!
          </p>
        </div>

        {/* Success Message */}
        <div className="mt-8 p-6 bg-green-100 border-l-4 border-primary rounded-lg">
          <h3 className="text-xl font-bold text-green-800 mb-2">
            ✅ Tailwind CSS is Working!
          </h3>
          <p className="text-green-700">
            All custom colors, utilities, and configurations are loaded correctly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestTailwind;
