import StreetPlate from "../src/components/StreetPlate";
import OrderForm, {ButtonSendOrderContext, defaultMessageData} from '../src/components/OrderForm';
import ChangeColor, {ChangeColorContext, COLORS} from "../src/components/ChangeColor";
import React from "react";
import Style from '../src/styles/Home.module.css';
import Head from 'next/head';
import Image from "next/image";

const keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const triplet = (e1, e2, e3) =>
    keyStr.charAt(e1 >> 2) +
    keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
    keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
    keyStr.charAt(e3 & 63)

const rgbDataURL = (r, g, b) =>
    `data:image/gif;base64,R0lGODlhAQABAPAA${
        triplet(0, r, g) + triplet(b, 255, 255)
    }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

const Home = () => {
    const [colorContext, setColorContext] = React.useState(COLORS[0]);  //насколько костыль так делать???
    const valueColorContext = {colorContext, setColorContext};
    const [buttonSendOrderContext, setButtonSendOrderContext] = React.useState(defaultMessageData);
    const valueButtonSendOrderContext = {buttonSendOrderContext, setButtonSendOrderContext};

    return (
        <>
            <Head>
                <title>Адресные таблички | Дизайн-код Екатеринбурга</title>
                <link rel="icon" href="./icon.png" type="image/png"/>
                <meta name="viewport" content="width=768, user-scalable=no" lang={'ru'}/>
            </Head>

            <div className={Style.my_header}>
                <div className={"header_link_container"} style={{marginTop: "2em"}}>
                    <a href={'https://ekaterinburg.design/'} className={Style.header_link} rel="noreferrer"
                       target='_blank'>
                        Дизайн-код Екатеринбурга
                    </a>
                </div>
                <a style={{zIndex: "1"}} href="#order" className={Style.button_to_scroll}>
                    Заказать табличку
                </a>
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
            <div className={Style.bad_plates_container}/>
            <div>
                <p className={Style.line}>_____</p>
                <p className={Style.doc_link}>
                    <a href={'https://docs.google.com/document/d/1etPPaqAu97npLfrJSLkCIbtDx4_RMURUv5bBg2AFr9U/edit?usp=sharing'}
                       rel="noreferrer" target='_blank' tabIndex={0}>
                        Анонс в гуглодоке
                    </a>
                </p>
                <p className={Style.line}>_____</p>
            </div>
            <ButtonSendOrderContext.Provider value={valueButtonSendOrderContext}>
                <ChangeColorContext.Provider value={valueColorContext}>
                    {/*<div className={Style.container_form}>*/}
                        <div className={Style.form_wrapper}>
                            <div className={Style.front}>
                                {/*<div style={{zIndex: "-1"}}/>*/}
                                {/*<Image src={`/${colorContext.frontImage}`}*/}
                                {/*       alt={colorContext.color}*/}
                                {/*       layout='fill'*/}
                                {/*       placeholder='blur'*/}
                                {/*       blurDataURL={rgbDataURL(156,156,156)}*/}
                                {/*       priority*/}
                                {/*        />*/}
                                <div id="order" className={Style.front_wrapper}>
                                    <h1 className={Style.h1_wrapper}>Заказ адресной<br/>таблички</h1>
                                    <p className={Style.p_wrapper}>Введите название улицы и номер дома</p>
                                    <StreetPlate/>
                                </div>
                            </div>
                            <div className={Style.inputs}>
                                {/*<div className={Style.change_color_container}>*/}
                                {/*    <p className={Style.inputs_p_wrapper}>Цвет фасада</p>*/}
                                {/*    <ChangeColor/>*/}
                                {/*</div>*/}
                                <OrderForm/>
                            </div>
                        </div>
                    {/*</div>*/}
                </ChangeColorContext.Provider>
            </ButtonSendOrderContext.Provider>
        </>
    )
}

export default Home;
