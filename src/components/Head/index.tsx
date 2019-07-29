import React from 'react';
import styles from './styles.scss';
import Form from '@src/components/Form';
import SignBtn from '@components/SignBtn';
import AccountStore from '@stores/AccountStore';
import { inject, observer } from 'mobx-react';
import Avatar from '@components/Avatar';
import { DAPP_ADDRESS } from '@stores/DappStore';


interface IProps {
    accountStore?: AccountStore
}

@inject('accountStore')
@observer
export default class Head extends React.Component<IProps> {

    render(): React.ReactNode {
        const {wavesKeeperAccount} = this.props.accountStore!;
        return <div className={styles.bg}>
            <div className={styles.h}>
                <div className={styles.header}>
                    <div className={styles.header_logoFont}>Exchanger with constant liquidity</div>
                    {
                        wavesKeeperAccount
                            ? <div className={styles.header_sign}>
                                <Avatar className={styles.header_avatar} address={wavesKeeperAccount.address}/>
                                {wavesKeeperAccount.address}
                            </div>
                            : <SignBtn className={styles.header_sign}>
                                <div className={styles.header_signIcon}/>
                                Sign in with Keeper
                            </SignBtn>
                    }
                </div>
                <div className={styles.body}>
                    <div className={styles.info}>
                    <div className={styles.header_logoFont}>Demo version of exchanger with constant liquidity
                             You can learn more about the state of dApp in Waves Explorer</div>
                        <a className={styles.header_logoFont}

                            href={`https://wavesexplorer.com/address/${DAPP_ADDRESS}`}>Waves Explorer</a>
                    </div>
                    <div className={styles.form}>
                        <Form/>
                    </div>
                </div>
            </div>
            <div className={styles.footer}/>
        </div>;
    }
}
