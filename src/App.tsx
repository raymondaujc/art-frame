import { ProjectProvider } from './context/ProjectContext';
import { ImageUploader } from './components/ImageUploader';
import { DimensionInput } from './components/DimensionInput';
import { MatBoardConfig } from './components/MatBoardConfig';
import { FrameSelector } from './components/FrameSelector';
import { GlassSelector } from './components/GlassSelector';
import { CanvasRenderer } from './components/CanvasRenderer';
import { ExportControls } from './components/ExportControls';

function App() {
  return (
    <ProjectProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Online Painting Framer</h1>
            <p className="text-sm text-gray-600 mt-1">
              Upload your painting, configure mat and frame, then preview and export
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Configuration */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ImageUploader />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <DimensionInput />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <MatBoardConfig />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <FrameSelector />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <GlassSelector />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ExportControls />
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <CanvasRenderer />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-500">
              <p>Online Painting Framer MVP - Built with React, TypeScript, and Canvas 2D</p>
              <p className="mt-2">
                Upload your painting, specify dimensions, choose mat and frame, then export your preview
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ProjectProvider>
  );
}

export default App;
