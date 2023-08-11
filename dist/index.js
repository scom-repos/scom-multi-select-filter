var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-multi-select-filter/store/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-multi-select-filter/store/index.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-multi-select-filter/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.collaspeStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    const labelStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 8,
        flexDirection: 'row-reverse',
        padding: '0.5rem 1rem'
    };
    exports.collaspeStyle = components_1.Styles.style({
        $nest: {
            'i-icon.rotate-icon': {
                transform: 'rotate(-180deg)',
                // transition: 'transform .2s ease'
            },
            'i-checkbox:not(.subcheckbox) label.i-checkbox': Object.assign(Object.assign({}, labelStyle), { padding: '0.5rem' }),
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
    });
});
define("@scom/scom-multi-select-filter", ["require", "exports", "@ijstech/components", "@scom/scom-multi-select-filter/index.css.ts"], function (require, exports, components_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomMultiSelectFilter = class ScomMultiSelectFilter extends components_2.Module {
        get filter() {
            return this._filter;
        }
        set filter(data) {
            this._filter = data;
            this.updateFilters();
            if (this.btnClear) {
                this.toggleClearButton();
            }
        }
        set data(data) {
            this._data = data;
            this.renderFilters();
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        constructor(parent, options) {
            super(parent, options);
            this._filter = {};
            this.checkboxesMapper = new Map();
            this.radioGroupMapper = new Map();
            this.customInputMapper = new Map();
            this.updateFilters = () => {
                [...this.radioGroupMapper.keys()].forEach(_k => {
                    var _a, _b, _c;
                    const radioGroup = this.radioGroupMapper.get(_k);
                    if (this._filter[_k]) {
                        radioGroup.selectedValue = ((_a = radioGroup.tag) !== null && _a !== void 0 ? _a : []).findIndex((opt) => {
                            var _a;
                            return ((_a = this._filter[_k]) === null || _a === void 0 ? void 0 : _a[0]) === opt.value;
                        }).toString();
                    }
                    else {
                        radioGroup.selectedValue = '';
                    }
                    if (this.customInputMapper.has(_k)) {
                        const input = this.customInputMapper.get(_k);
                        input.value = _k ? (_c = (_b = this._filter[_k]) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "" : "";
                    }
                });
                this.checkboxesMapper.forEach((checkbox, key) => {
                    const arr = key.split('|');
                    const value = this._filter[arr[0]];
                    checkbox.checked = value && (value.includes(arr[1]) || value.includes(arr[2]));
                });
            };
            this.renderFilters = () => {
                if (!this.pnlFilter)
                    return;
                this.pnlFilter.clearInnerHTML();
                this.checkboxesMapper.clear();
                this.radioGroupMapper.clear();
                this.customInputMapper.clear();
                this._data.forEach((data) => {
                    const filters = data.type === 'checkbox' ?
                        this.renderCheckboxFilters(data) : this.renderRadioFilters(data);
                    const icon = (this.$render("i-icon", { position: "absolute", right: 0, width: 24, height: 24, class: `${data.expanded ? 'rotate-icon' : ''} pointer icon-filter--chevron`, name: "chevron-down", fill: Theme.text.primary, padding: { top: 6, bottom: 6, left: 6, right: 6 }, onClick: (src) => this.toggle(filters, src) }));
                    const clearButton = (this.$render("i-button", { id: "btnClear", caption: "Clear", opacity: 0.5, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.5rem', right: '0.5rem' }, margin: { left: 'auto' }, border: { width: 1, style: 'solid', color: Theme.colors.secondary.light, radius: 4 }, background: { color: 'transparent' }, font: { color: Theme.text.primary, size: '0.75rem' }, icon: { name: 'times-circle', fill: Theme.text.primary, width: 12, height: 12 }, visible: !!Object.keys(this.filter).length, onClick: this.clearFilters.bind(this) }));
                    this.pnlFilter.append(this.$render("i-panel", { class: index_css_1.collaspeStyle },
                        this.$render("i-hstack", { position: "relative", verticalAlignment: "center", horizontalAlignment: "space-between", padding: { top: '0.5rem', right: '2.25rem', bottom: '0.5rem', left: '1rem' }, border: { radius: 5, bottom: { width: '1px', style: 'solid', color: Theme.text.primary } }, gap: "8px", minHeight: 41, class: "filter-collapse" },
                            this.$render("i-label", { font: { bold: true }, caption: data.name }),
                            clearButton,
                            icon),
                        this.$render("i-panel", { width: "calc(100% - 1rem)", margin: { left: 'auto' }, border: { bottom: { width: '1px', style: 'solid', color: Theme.divider } } }),
                        filters));
                });
            };
            this.renderRadioFilters = (data) => {
                const options = data.options;
                const radioGroup = this.renderRadios(data.key, options, data.custom);
                const customFields = data.custom ? this.renderCustomFields(data, radioGroup) : [];
                return (this.$render("i-vstack", { visible: !!data.expanded, margin: { top: '1rem', bottom: '1rem' }, padding: { bottom: '1.5rem' }, gap: "0.75rem" },
                    radioGroup,
                    customFields));
            };
            this.applyCustomRadio = (key, input) => {
                let hasValue = !!input.value;
                const inputValue = input.value;
                if (!hasValue)
                    return;
                if (inputValue)
                    this._filter[key] = [inputValue];
                else
                    delete this._filter[key];
                this.btnClear.visible = true;
                if (this.onFilterChanged)
                    this.onFilterChanged(this._filter);
            };
            this.onRadioChanged = (target, key, options) => {
                if (target.selectedValue === '')
                    return;
                const option = options[target.selectedValue];
                if (option.isAll) {
                    if (this._filter[key])
                        delete this._filter[key];
                }
                else {
                    if (option.value)
                        this._filter[key] = [option.value];
                    else
                        delete this._filter[key];
                }
                this.toggleClearButton();
                if (this.onFilterChanged)
                    this.onFilterChanged(this._filter);
            };
            this.renderCheckboxFilters = (data) => {
                const options = data.options;
                const checkboxes = this.renderCheckboxes(data.key, options, true);
                const hasSubCheckbox = options.some(opt => { var _a; return ((_a = opt.subCheckbox) === null || _a === void 0 ? void 0 : _a.length) > 0; });
                return (this.$render("i-vstack", { visible: !!data.expanded, margin: { top: '1rem' }, padding: { bottom: '1rem' }, gap: hasSubCheckbox ? "1.25rem" : "4px" }, checkboxes));
            };
            this._updateSubFilter = (filterKey, options, selectAll, curValue) => {
                if (options) {
                    if (selectAll && options.length <= 1)
                        return;
                    options.forEach(opt => {
                        if (selectAll) {
                            const idx = this._filter[filterKey].indexOf(opt.value);
                            if (idx >= 0) {
                                this._filter[filterKey].splice(idx, 1);
                            }
                        }
                        else {
                            if (curValue === opt.value)
                                return;
                            this._filter[filterKey].push(opt.value);
                        }
                    });
                }
            };
            this.onSelectAll = (filterKey, checkboxKey, option, checked) => {
                const keys = [...this.checkboxesMapper.keys()].filter(k => k !== checkboxKey && k.startsWith(checkboxKey));
                keys.forEach(_k => {
                    if (!this.checkboxesMapper.has(_k))
                        return;
                    this.checkboxesMapper.get(_k).checked = checked;
                });
                if (!this._filter[filterKey])
                    this._filter[filterKey] = [];
                const index = this._filter[filterKey].indexOf(option.value);
                if (checked && index == -1) {
                    this._filter[filterKey].push(option.value);
                    this._updateSubFilter(filterKey, option.subCheckbox, true);
                }
                else if (!checked && index >= 0) {
                    this._filter[filterKey].splice(index, 1);
                }
                this.toggleClearButton();
                if (this.onFilterChanged)
                    this.onFilterChanged(this._filter);
            };
            this.onSelectCheckbox = (filterKey, parentKey, curOption, options, checked) => {
                if (!this._filter[filterKey])
                    this._filter[filterKey] = [];
                const parentIndex = this._filter[filterKey].indexOf(parentKey);
                const _mapKey = `${filterKey}|${parentKey}`;
                const index = this._filter[filterKey].indexOf(curOption.value);
                const keys = [...this.checkboxesMapper.keys()].filter(k => k !== _mapKey && k.startsWith(_mapKey));
                if (checked) {
                    const isAllChecked = keys.every(_k => this.checkboxesMapper.get(_k).checked);
                    if (isAllChecked) {
                        if (this.checkboxesMapper.has(_mapKey)) {
                            this.checkboxesMapper.get(_mapKey).checked = true;
                        }
                        this._filter[filterKey].push(parentKey);
                        this._updateSubFilter(filterKey, options, true);
                    }
                    else if (index == -1) {
                        this._filter[filterKey].push(curOption.value);
                    }
                }
                else {
                    if (index >= 0) {
                        this._filter[filterKey].splice(index, 1);
                    }
                    if (parentIndex >= 0) {
                        this._filter[filterKey].splice(parentIndex, 1);
                    }
                    if (this.checkboxesMapper.has(_mapKey)) {
                        if (this.checkboxesMapper.get(_mapKey).checked) {
                            this._updateSubFilter(filterKey, options, false, curOption.value);
                        }
                        this.checkboxesMapper.get(_mapKey).checked = false;
                    }
                }
                this.toggleClearButton();
                if (this.onFilterChanged)
                    this.onFilterChanged(this._filter);
            };
        }
        toggle(container, icon) {
            container.visible = !container.visible;
            icon.classList.toggle('rotate-icon');
        }
        clearFilters() {
            this.filter = {};
            this.btnClear.visible = false;
            if (this.onFilterChanged)
                this.onFilterChanged(this._filter);
        }
        toggleClearButton() {
            this.btnClear.visible = this._filter && !!Object.values(this._filter).find(item => item.length);
        }
        renderCustomFields(data, radioGroup) {
            var _a, _b, _c;
            const input = (this.$render("i-input", { width: "100%", height: 40, border: { radius: 8 }, placeholder: (_a = data.custom.placeholder) !== null && _a !== void 0 ? _a : '', inputType: data.custom.type, value: radioGroup.selectedValue == '' ? (_c = (_b = this._filter[data.key]) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : '' : '', onFocus: () => {
                    if (radioGroup.selectedValue != '')
                        radioGroup.selectedValue = '';
                } }));
            this.customInputMapper.set(data.key.toString(), input);
            return (this.$render("i-vstack", { class: "radio-custom", gap: "0.75rem", padding: { left: '1rem', right: '1rem' } },
                this.$render("i-hstack", { gap: "0.5rem", verticalAlignment: "center" }, input),
                this.$render("i-button", { width: "100%", caption: "Apply", font: { color: Theme.colors.primary.contrastText }, padding: { top: '1rem', bottom: '1rem', left: '1rem', right: '1rem' }, onClick: () => {
                        if (radioGroup.selectedValue === '')
                            this.applyCustomRadio(data.key, input);
                    } })));
        }
        renderRadios(key, options, custom) {
            let selectedValue = '';
            const items = options.map((opt, idx) => {
                var _a;
                if (((_a = this._filter[key]) === null || _a === void 0 ? void 0 : _a[0]) === opt.value) {
                    selectedValue = idx.toString();
                }
                return {
                    caption: opt.label,
                    value: idx.toString(),
                    width: '100%',
                    height: 'auto',
                    captionWidth: 'auto'
                };
            });
            if (custom)
                items.push({
                    caption: 'Custom',
                    value: '',
                    width: '100%',
                    height: 'auto',
                    captionWidth: 'auto'
                });
            const radioGroup = (this.$render("i-radio-group", { width: "100%", display: "flex", padding: { left: '1rem' }, radioItems: items, onChanged: (target) => this.onRadioChanged(target, key, options), selectedValue: selectedValue, tag: options }));
            this.radioGroupMapper.set(key, radioGroup);
            return radioGroup;
        }
        renderCheckboxes(filterKey, options, isParent, keyPrefix) {
            var _a;
            const checkboxes = [];
            for (const opt of options) {
                const key = `${keyPrefix ? keyPrefix + '|' : ''}${opt.value}`;
                const subCheckboxes = ((_a = opt.subCheckbox) === null || _a === void 0 ? void 0 : _a.length) ? this.renderCheckboxes(filterKey, opt.subCheckbox, false, key) : [];
                const checked = this._filter[filterKey] && (this._filter[filterKey].includes(opt.value) || this._filter[filterKey].includes(keyPrefix));
                const checkbox = (this.$render("i-checkbox", { height: "auto", class: isParent ? 'parentcheckbox' : 'subcheckbox', caption: opt.label, checked: checked !== null && checked !== void 0 ? checked : false, margin: { bottom: isParent ? '4px' : '0', left: isParent ? '1rem' : 0 }, onChanged: (source, event) => {
                        const _checkbox = source;
                        if (isParent)
                            this.onSelectAll(filterKey, `${filterKey}|${key}`, opt, _checkbox.checked);
                        else
                            this.onSelectCheckbox(filterKey, keyPrefix, opt, options, _checkbox.checked);
                    } }));
                this.checkboxesMapper.set(`${filterKey}|${key}`, checkbox);
                checkboxes.push(this.$render("i-vstack", { margin: { left: isParent ? 0 : '1rem' }, stack: { basis: '100%' }, gap: "4px" },
                    checkbox,
                    subCheckboxes));
            }
            return checkboxes;
        }
        init() {
            super.init();
            const data = this.getAttribute('data', true);
            if (data) {
                this.data = data;
            }
            const onFilterChanged = this.getAttribute('onFilterChanged', true);
            if (onFilterChanged) {
                this.onFilterChanged = onFilterChanged;
            }
        }
        render() {
            return (this.$render("i-panel", { id: "pnlFilter", padding: { bottom: '1rem' } }));
        }
    };
    ScomMultiSelectFilter = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-multi-select-filter')
    ], ScomMultiSelectFilter);
    exports.default = ScomMultiSelectFilter;
});
