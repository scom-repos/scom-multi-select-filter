import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

const labelStyle: { [key: string]: string | number } = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: 8,
  flexDirection: 'row-reverse',
  padding: '0.35rem 1rem'
}

export const collaspeStyle = Styles.style({
  $nest: {
    'i-icon.rotate-icon': {
      transform: 'rotate(-180deg)',
      transition: 'transform .2s ease'
    },
    'label.i-checkbox': labelStyle,
    'label.i-radio': labelStyle,
    'label.i-checkbox:hover': {
      background: Theme.action.hover
    },
    'label.i-radio:hover': {
      background: Theme.action.hover
    },
    '.filter-collapse:hover': {
      background: Theme.action.hover
    },
    'i-checkbox': {
      borderRadius: 5,
      overflow: 'hidden'
    },
    'i-radio': {
      borderRadius: 5,
      overflow: 'hidden'
    },
    '.i-checkbox_label': {
      padding: 0
    },
    '.subcheckbox:not(.is-checked) .i-checkbox_label': {
      color: Theme.text.secondary
    },
    'i-checkbox .checkmark': {
      width: 24,
      height: 24,
      borderRadius: 4
    },
    'i-checkbox .checkmark:after': {
      top: 2,
      height: 12.5,
      width: 5.8
    },
    'i-radio-group': {
      flexDirection: 'column',
      gap: '0.5rem'
    },
    'i-radio input[type="radio"]': {
      width: 20,
      height: 20,
      margin: 2
    },
    '.radio-custom input': {
      width: '100% !important',
      padding: '0.25rem 0.75rem 0.25rem 0.75rem'
    },
  }
})
