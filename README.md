# Online Painting Framer MVP

A web-based application that allows users to upload painting images, specify dimensions, configure mat boards and frames, and generate true-to-scale visual previews with export capabilities.

## Features

- **Image Upload**: Upload JPG/PNG images up to 6MB
- **Dimension Input**: Specify painting dimensions in cm or inches
- **Mat Board Configuration**: Toggle mat board with uniform or individual margin settings
- **Frame Selection**: Choose from pre-configured frames or create custom frames
- **Glass Options**: Select glass type (none, clear, frosted)
- **Live Preview**: Real-time canvas rendering with true-to-scale proportions
- **Export**: Download high-resolution PNG images
- **Project Persistence**: Save/load projects via localStorage

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Rendering**: HTML Canvas 2D API
- **State Management**: React Context + hooks
- **Storage**: localStorage for project persistence

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the provided local URL

## Usage

1. **Upload Image**: Drag and drop or click to upload your painting image
2. **Set Dimensions**: Enter the actual width and height of your painting
3. **Configure Mat**: Choose whether to use a mat board and set margins
4. **Select Frame**: Pick a frame from the library or create a custom one
5. **Choose Glass**: Select the glass type for your frame
6. **Preview**: See your framed painting rendered to scale
7. **Export**: Download the high-resolution preview image

## Project Structure

```
src/
├── components/          # React components
│   ├── ImageUploader.tsx
│   ├── DimensionInput.tsx
│   ├── MatBoardConfig.tsx
│   ├── FrameSelector.tsx
│   ├── GlassSelector.tsx
│   ├── CanvasRenderer.tsx
│   └── ExportControls.tsx
├── context/            # State management
│   └── ProjectContext.tsx
├── data/              # Static data
│   └── frames.json
├── types/             # TypeScript interfaces
│   └── index.ts
├── utils/             # Utility functions
│   ├── unitConverter.ts
│   ├── canvasRenderer.ts
│   └── imageProcessor.ts
└── App.tsx           # Main application component
```

## Key Features Implementation

- **True-to-Scale Rendering**: All calculations use millimeters as the canonical unit
- **Layered Composition**: Frame → Glass effect → Mat board → Painting
- **Responsive Design**: Desktop-first layout that works on mobile
- **Real-time Updates**: Canvas re-renders automatically when settings change
- **Error Handling**: Comprehensive validation and user feedback
- **Performance**: Optimized rendering with debounced updates

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License