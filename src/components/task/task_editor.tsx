import {EditorContent,  useEditor,FloatingMenu,BubbleMenu} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import { GripVerticalIcon } from 'lucide-react';
import { useEffect } from 'react';
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Text from '@tiptap/extension-text'


const extensions = [StarterKit,Document,
      Paragraph,
      Text,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),]

interface TaskEditorProps {
  content: string;
onChange: (content: string) => void;
}

export function TaskEditor({content, onChange}: TaskEditorProps) {

   const editor = useEditor({
    extensions,
    content,

    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      onChange(updatedContent);
    },
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== editor.getHTML()) {
      editor.commands.setContent(content,false);
    }
  }, [content, editor]);

    return (
        <>        
        <EditorContent  editor={editor}>
            <FloatingMenu editor={editor}>
                <GripVerticalIcon className="w-6 h-6 text-gray-500 cursor-move" />
                </FloatingMenu>
        </EditorContent>
        </>
    );
    }