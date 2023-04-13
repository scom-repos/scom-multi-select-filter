import { Module, customModule, Container, HStack } from '@ijstech/components';
import ScomMultiSelectFilter, { ICheckboxFilterData } from '@scom/scom-multi-select-filter'

const microDapps: ICheckboxFilterData[] = [
    {
        name: "MicroDapps",
        key: "categories",
        type: 'checkbox',
        expanded: true,
        options: [
            {
                label: "Embed To Earn",
                value: "embed-to-earn",
                subCheckbox: [
                    {
                        label: "Donation",
                        value: "donation",
                    },
                    {
                        label: "NFT Mint",
                        value: "nft-mint",
                    },
                    {
                        label: "Gem Tokens",
                        value: "gem-tokens",
                    },
                    {
                        label: "Games",
                        value: "games",
                    },
                    {
                        label: "Swaps",
                        value: "swaps",
                    }
                ]
            },
            {
                label: "Embed for Free",
                value: "embed-for-free",
                subCheckbox: [
                    {
                        label: "Map",
                        value: "map",
                    },
                    {
                        label: "Videos",
                        value: "videos",
                    },
                    {
                        label: "Randomizer",
                        value: "randomizer",
                    }
                ]
            }
        ]
    }
];

const tokens: ICheckboxFilterData[] = [
    {
        name: "Tokens",
        key: "tokens",
        type: "checkbox",
        expanded: true,
        options: [
            {
                label: "Native Tokens",
                value: "native-tokens",
                subCheckbox: [
                    {
                        label: "ETH",
                        value: "ETH",
                    },
                    {
                        label: "BNB",
                        value: "BNB",
                    },
                    {
                        label: "AVAX",
                        value: "AVAX",
                    }
                ]
            },
            {
                label: "Stablecoins",
                value: "stablecoins",
                subCheckbox: [
                    {
                        label: "USDC",
                        value: "USDC",
                    },
                    {
                        label: "USDT",
                        value: "USDT",
                    },
                    {
                        label: "BUSD",
                        value: "BUSD",
                    }
                ]
            }
        ]
    }
];

@customModule
export default class Module1 extends Module {
    private multiSelectFilter1: ScomMultiSelectFilter;
    private multiSelectFilter2: ScomMultiSelectFilter;
    private hStackMainTest: HStack;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    private onFilterChanged(filter: { [key: string]: string[] }) {
        console.log(filter)
    }

    async init() {
        super.init();
        this.multiSelectFilter2 = await ScomMultiSelectFilter.create({
            width: 300,
            maxWidth: '100%',
            data: tokens,
            onFilterChanged: this.onFilterChanged
        });
        this.hStackMainTest.appendChild(this.multiSelectFilter2);
    }

    render() {
        return <i-panel>
            <i-hstack id="hStackMainTest" margin={{ top: 20 }} gap={100} wrap="wrap">
                <i-scom-multi-select-filter
                    id="multiSelectFilter1"
                    width={300}
                    maxWidth="100%"
                    data={microDapps}
                    onFilterChanged={this.onFilterChanged.bind(this)}
                    overflow="auto"
                />
            </i-hstack>
        </i-panel>
    }
}