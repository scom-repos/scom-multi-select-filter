import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

const labelStyle: any = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: 8,
  flexDirection: 'row-reverse',
  padding: '0.5rem 1rem'
}

export const collaspeStyle = Styles.style({
  $nest: {
    'i-icon.rotate-icon': {
      transform: 'rotate(-180deg)',
      // transition: 'transform .2s ease'
    },
    'i-checkbox:not(.subcheckbox) label.i-checkbox': {
      ...labelStyle,
      padding: '0.5rem'
    },
    '.parentcheckbox .checkmark': {
      borderColor: 'rgba(0, 0, 0, 0.25)'
    },
    '.subcheckbox label.i-checkbox': {
      width: '100%',
      gap: 8,
      padding: '0.5rem 1rem',
      borderRadius: 4,
      background: Theme.action.hover
    },
    'label.i-radio': labelStyle,
    'label.i-checkbox:hover': {
      background: Theme.action.hover
    },
    'label.i-radio:hover': {
      background: Theme.action.hover
    },
    '.icon-filter--chevron:hover': {
      borderRadius: 4,
      background: Theme.action.hover
    },
    '.filter-collapse:hover': {
      // background: Theme.action.hovers
    },
    'i-checkbox': {
      borderRadius: 5,
      overflow: 'hidden'
    },
    'i-radio': {
      borderRadius: 5,
      overflow: 'hidden',
      background: Theme.action.hover
    },
    '.i-checkbox_label': {
      padding: 0
    },
    // '.subcheckbox:not(.is-checked) .i-checkbox_label': {
    //   color: Theme.text.secondary
    // },
    'i-checkbox .checkmark': {
      width: 24,
      height: 24,
      borderRadius: 4,
      opacity: 0.5
    },
    'i-checkbox .checkmark:after': {
      top: 2,
      height: 12.5,
      width: 5.8,
      border: '1px solid #000',
      borderTop: 'none',
      borderLeft: 'none'
    },
    'i-radio-group': {
      flexDirection: 'column',
      gap: "0.5rem"
    },
    'i-radio input[type="radio"]': {
      width: 20,
      height: 20,
      margin: '0px 2px 2px',
      cursor: 'pointer'
    },
    '.radio-custom input': {
      width: '100% !important',
      padding: '0.25rem 0.75rem 0.25rem 0.75rem'
    },
    'i-checkbox.is-checked .checkmark, i-checkbox .is-indeterminate .checkmark': {
      backgroundColor: '#fff',
      opacity: 1
    },
    'i-checkbox.is-checked .i-checkbox_label': {
      color: Theme.text.primary
    }
  }
})
