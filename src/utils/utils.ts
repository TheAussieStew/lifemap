import { EditorView } from '@tiptap/pm/view';
import { v4 as uuidv4 } from 'uuid';

export const generateUniqueID = () => uuidv4()

export const clickElement = (ref: React.RefObject<HTMLDivElement>) => {
  ref.current!.dispatchEvent(
    new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      buttons: 1,
    }),
  );
};

export function getActiveMarkCodes (view: EditorView) {
    const isEmpty = view.state.selection.empty;
    const state = view.state;
  
    if (isEmpty) {
      const $from = view.state.selection.$from;
      const storedMarks = state.storedMarks;
  
      // Return either the stored marks, or the marks at the cursor position.
      // Stored marks are the marks that are going to be applied to the next input
      // if you dispatched a mark toggle with an empty cursor.
      if (storedMarks) {
        return storedMarks.map((mark) => mark.type.name);
      } else {
        return $from.marks().map((mark) => mark.type.name);
      }
    } else {
      const $head = view.state.selection.$head;
      const $anchor = view.state.selection.$anchor;
  
      // We're using a Set to not get duplicate values
      const activeMarks = new Set();
  
      // Here we're getting the marks at the head and anchor of the selection
      $head.marks().forEach((mark) => activeMarks.add(mark.type.name));
      $anchor.marks().forEach((mark) => activeMarks.add(mark.type.name));
  
      return Array.from(activeMarks);
    }
  }