import { Link } from '@tiptap/extension-link'

export const CustomLink = Link.extend({
  // @ts-ignore
  addCommands() {
    return {
  // @ts-ignore
      promptLink: () => ({ commands }) => {
        const url = window.prompt('URL')

        if (url) {
          return commands.setLink({ href: url })
        } else {
          return commands.unsetLink()
        }
      },
    }
  },
  addKeyboardShortcuts() {
    return {
  // @ts-ignore
      'Mod-k': () => this.editor.commands.promptLink(),
    }
  },
})