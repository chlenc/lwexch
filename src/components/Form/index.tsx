import React from 'react';
import styles from './styles.scss';
import SignBtn from '@components/SignBtn';
import { inject, observer } from 'mobx-react';
import { AccountStore, DappStore } from '@stores';
import PriceInfo from '@components/Form/PriceInfo';

const m = 1e8;

interface IState {
    isWavesToken: boolean,
    tokensCount: number,
    minPrice: number
}

interface IProps {
    dappStore?: DappStore,
    accountStore?: AccountStore
}

@inject('accountStore', 'dappStore')
@observer
export default class FreedForm extends React.Component<IProps, IState> {

    state: IState = {
        isWavesToken: true,
        tokensCount: 0,
        minPrice: 0
    };

    private handleChangeTokensCount = (e) => this.setState({tokensCount: +e.target.value});
    private handleChangeMinPrice = (e) => this.setState({minPrice: +e.target.value});

    private handleExchange = (minAmount: number) =>
        this.props.dappStore!.exchange(this.state.tokensCount, this.state.isWavesToken, minAmount);

    private handleOnWavesToken = () => this.setState({isWavesToken: true});

    private handleOffWavesToken = () => this.setState({isWavesToken: false});

    round8 = (n) => n.toFixed(8).floor();


    private get wavesAmount() {
        const {liquidAmount, wavesAmount} = this.props.dappStore!;
        const {tokensCount} = this.state;
        return (liquidAmount * tokensCount) / (wavesAmount + tokensCount);
    }

    private get liquidAmount() {
        const {liquidAmount, wavesAmount} = this.props.dappStore!;
        const {tokensCount} = this.state;
        return (wavesAmount * tokensCount) / (liquidAmount + tokensCount);
    }

    handleFocus = (e) => e.target.select();

    render(): React.ReactNode {
        const {isWavesToken, tokensCount, minPrice} = this.state;
        const {isApplicationAuthorizedInWavesKeeper: isLogin} = this.props.accountStore!;
        const payment = this.round8(isWavesToken ? this.wavesAmount : this.liquidAmount);
        let price = 0;
        if (isWavesToken && payment !== 0 && tokensCount !== 0) {
            price = this.round8(tokensCount / payment);
        } else if (!isWavesToken && payment !== 0 && tokensCount !== 0) {
            price = this.round8(payment / tokensCount);
        }
        const minAmount = isWavesToken ?( minPrice === 0 ? 0 : tokensCount / minPrice): ( minPrice === 0 ? 0 : tokensCount * minPrice) ;
        return <div className={styles.root}>

            <div>
                <div className={styles.header1Font}>Exchanger</div>
                <div className={styles.termInfField}>
                    <div className={styles.header2Font}>Choose token you pay:</div>

                    <div className={styles.termInfField_buttonSet}>
                        <button
                            onClick={this.handleOnWavesToken}
                            className={isWavesToken ? styles.leftCheckbox_selected : styles.leftCheckbox}
                        >
                            WAVES
                        </button>

                        <button
                            onClick={this.handleOffWavesToken}
                            className={isWavesToken ? styles.rightCheckbox : styles.rightCheckbox_selected}
                        >
                            LIQUID
                        </button>
                    </div>
                </div>
                    <div className={styles.borderBottom}>
                        <div className={styles.calculateField_col}>
                            <div className={styles.header2Font}>
                                Exchange amount
                            </div>
                            <div className={styles.captionFont}>You pay</div>
                            <div className={styles.inputField}>
                                {isWavesToken ? <div className={styles.wavesIcn}/> : <div className={styles.btcIcn}/>}
                                <input
                                    className={styles.input}
                                    type="number"
                                    onChange={this.handleChangeTokensCount}
                                    onFocus={this.handleFocus}
                                    value={tokensCount}
                                />
                            </div>
                            <br/>
                            <div className={styles.rateField_row}>
                                Price:
                                <div className={styles.rateFont}>
                                    <b className={styles.rateCount}>~&nbsp;{price}</b> &nbsp;
                                    <div className={styles.rateFont_btc}>LIQUID</div>
                                    &nbsp;/&nbsp;
                                    <div className={styles.rateFont_waves}>WAVES</div>
                                </div>
                            </div>
                            <div className={styles.rateField_row}>
                                You get:
                                <div className={styles.rateFont}>
                                    <b className={styles.rateCount}>~&nbsp;{payment}</b> &nbsp;
                                    {isWavesToken ? 
                                     <div className={styles.rateFont_btc}>LIQUID</div>:
                                     <div className={styles.rateFont_waves}>WAVES</div>
                                    }
                                </div>
                            </div>

                    </div>

                </div>
                <div className={styles.flex}>
                    <div className={styles.captionFont}>{isWavesToken ? 'Maximal' : 'Minimal'} price</div>
                    &nbsp;
                    <PriceInfo/>
                </div>
                <div className={styles.inputField}>
                    <input
                        className={styles.min}
                        type="number"
                        onChange={this.handleChangeMinPrice}
                        onFocus={this.handleFocus}
                        value={minPrice}
                    />
                </div>
                <br/>
                <div className={styles.rateField_row}>
                    Min amount:
                    <div className={styles.rateFont}>
                        <b className={styles.rateCount}>{this.round8(minAmount)}</b> &nbsp;
                        <div className={styles.rateFont_btc}>LIQUID</div>
                    </div>
                </div>

            </div>

            <div>
                <div className={styles.yellowCaption}>For the exchange transaction you need to login into
                    WavesKeeeper
                </div>
                <div className={styles.btnField}>
                    <SignBtn>
                        <button
                            disabled={isLogin}
                            className={styles.submitBnt}>
                            Log in
                        </button>
                    </SignBtn>
                    <button
                        disabled={!isLogin}
                        className={styles.submitBnt}
                        onClick={() => this.handleExchange(minAmount * m)}
                    >
                        Exchange
                    </button>
                </div>
            </div>
        </div>;
    }
}
