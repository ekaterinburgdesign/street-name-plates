import StreetPlate from "../src/components/StreetPlate";
import OrderForm, {defaultMessageData, ButtonSendOrderContext} from '../src/components/OrderForm';
import ChangeColor from "../src/components/ChangeColor";
import {COLORS, ChangeColorContext} from "../src/components/ChangeColor";
import React from "react";
import Style from '../src/styles/Home.module.css';
import Head from 'next/head';

const Home = () => {
    const [colorContext, setColorContext] = React.useState(COLORS[0]);  //насколько костыль так делать???
    const valueColorContext = {colorContext, setColorContext};

    const [buttonSendOrderContext, setButtonSendOrderContext] = React.useState(defaultMessageData);
    const valueButtonSendOrderContext = {buttonSendOrderContext, setButtonSendOrderContext};

    const refPlate = React.useRef(null);

    return (
        <>
            <Head>
                <title>Адресные таблички | Дизайн-код Екатеринбурга</title>
                <meta name="viewport" content="width=768, user-scalable=no" />
            </Head>

            <div className={Style.my_header}>
                <a href={''} className={Style.header_link} rel="noreferrer" target='_blank'>Дизайн-код Екатеринбурга</a>
                <a href="#order" className={Style.button_to_scroll}>Заказать табличку</a>
            </div>
            <div className={Style.description_wrapper}>
                <h1 className={Style.description_heading}>Адресные таблички</h1>
                <p className={Style.description_text}>
                    В Екатеринбурге несколько тысяч зданий, на каждом
                    из них висит как минимум одна адресная табличка.
                    Мы смотрим на них каждый день и с их помощью
                    ориентируемся в улицах и номерах домов. Это одна
                    из самых часто встречающихся деталей городской
                    навигации. Таблички могли бы выполнять не только
                    функциональную роль, но и воспитывать вкус
                    и насмотренность у жителей и гостей города.
                </p>
            </div>
            <div className={Style.bad_plates_container}></div>
            <div>
                <p className={Style.line}>_____</p>
                <p className={Style.doc_link}>
                    <a href={'https://docs.google.com/document/d/1etPPaqAu97npLfrJSLkCIbtDx4_RMURUv5bBg2AFr9U/edit?usp=sharing'}
                       rel="noreferrer" target='_blank' tabIndex={0}>
                        Черновик анонса в гуглодоке
                    </a>
                </p>
                <p className={Style.line}>_____</p>
            </div>
            <ButtonSendOrderContext.Provider value={valueButtonSendOrderContext}>
                <ChangeColorContext.Provider value={valueColorContext}>
                    <div style={{margin: '0px', padding: '0px'}}>
                        <div style={{backgroundImage: `url("${colorContext.frontImage}")`}} className={Style.front}>
                            <div id="order" className={Style.front_wrapper}>
                                <h1 className={Style.h1_wrapper}>Заказ адресной<br/>таблички</h1>
                                <p className={Style.p_wrapper}>Введите название улицы и номер дома</p>
                                <StreetPlate />
                            </div>
                        </div>
                        <div className={Style.inputs}>
                            <div className={Style.change_color_container}>
                                <p className={Style.inputs_p_wrapper}>Фасад</p>
                                <ChangeColor/>
                            </div>
                            <OrderForm/>
                        </div>
                    </div>
                </ChangeColorContext.Provider>
            </ButtonSendOrderContext.Provider>
        </>
    )
}

export default Home;
