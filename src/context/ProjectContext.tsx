import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ProjectState, Painting, Mat, Frame, GlassType } from '../types';

interface ProjectContextType {
  state: ProjectState;
  updatePainting: (painting: Painting | null) => void;
  updateMat: (mat: Mat) => void;
  updateFrame: (frame: Frame | null) => void;
  updateGlass: (glass: GlassType) => void;
  resetProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

type ProjectAction =
  | { type: 'UPDATE_PAINTING'; payload: Painting | null }
  | { type: 'UPDATE_MAT'; payload: Mat }
  | { type: 'UPDATE_FRAME'; payload: Frame | null }
  | { type: 'UPDATE_GLASS'; payload: GlassType }
  | { type: 'RESET_PROJECT' };

const initialState: ProjectState = {
  painting: null,
  mat: {
    enabled: false,
    marginMm: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50,
    },
  },
  frame: null,
  glass: 'clear',
};

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'UPDATE_PAINTING':
      return { ...state, painting: action.payload };
    case 'UPDATE_MAT':
      return { ...state, mat: action.payload };
    case 'UPDATE_FRAME':
      return { ...state, frame: action.payload };
    case 'UPDATE_GLASS':
      return { ...state, glass: action.payload };
    case 'RESET_PROJECT':
      return initialState;
    default:
      return state;
  }
}

const STORAGE_KEY = 'painting-framer-project';

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Validate the parsed state structure
        if (parsedState.painting !== undefined && parsedState.mat && parsedState.glass) {
          dispatch({ type: 'UPDATE_PAINTING', payload: parsedState.painting });
          dispatch({ type: 'UPDATE_MAT', payload: parsedState.mat });
          dispatch({ type: 'UPDATE_FRAME', payload: parsedState.frame });
          dispatch({ type: 'UPDATE_GLASS', payload: parsedState.glass });
        }
      }
    } catch (error) {
      console.error('Failed to load project from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save project to localStorage:', error);
    }
  }, [state]);

  const updatePainting = (painting: Painting | null) => {
    dispatch({ type: 'UPDATE_PAINTING', payload: painting });
  };

  const updateMat = (mat: Mat) => {
    dispatch({ type: 'UPDATE_MAT', payload: mat });
  };

  const updateFrame = (frame: Frame | null) => {
    dispatch({ type: 'UPDATE_FRAME', payload: frame });
  };

  const updateGlass = (glass: GlassType) => {
    dispatch({ type: 'UPDATE_GLASS', payload: glass });
  };

  const resetProject = () => {
    dispatch({ type: 'RESET_PROJECT' });
  };

  return (
    <ProjectContext.Provider
      value={{
        state,
        updatePainting,
        updateMat,
        updateFrame,
        updateGlass,
        resetProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
