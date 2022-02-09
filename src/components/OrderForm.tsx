import React, {useState} from "react";
import OrderButton from "./OrderButton";
import {StreetType} from "./StreetPlate";
import {ExportPrice} from "./StreetPlate";

type MessageDataType = {
    street: StreetType,
    build: string,
    color: string,
    plateLength: string,
    clientName: string,
    clientContact: string,
    montagePlate: boolean,
    dismantlingOldPlate: boolean,
    platePrice: number
}

export const defaultMessageData: MessageDataType = {
    street: undefined,
    build: undefined,
    color: undefined,
    plateLength: undefined,
    clientName: undefined,
    clientContact: undefined,
    montagePlate: true,
    dismantlingOldPlate: true,
    platePrice: 0
};

export const ButtonSendOrderContext = React.createContext({
    buttonSendOrderContext: defaultMessageData,
    setButtonSendOrderContext: (messageData: MessageDataType) => {
    }
})

function useInput(defaultValue) {
    const [value, setValue] = useState(defaultValue);

    function onChange(e) {
        setValue(e.target.value);
    }

    return {
        value,
        onChange,
    };
}

const checkboxesList = [
    "Демонтаж старой таблички",
    "Монтаж новой таблички"
];

const getDefaultCheckboxes = () =>
    checkboxesList.map((checkbox) => ({
        name: checkbox,
        checked: true,
    }));

function useCheckboxes(defaultCheckboxes) {
    const [checkboxes, setCheckboxes] = useState(
        defaultCheckboxes || getDefaultCheckboxes()
    );

    function setCheckbox(index, checked) {
        const newCheckboxes = [...checkboxes];
        newCheckboxes[index].checked = checked;
        setCheckboxes(newCheckboxes);
    }

    return {
        setCheckbox,
        checkboxes,
    };
}

function Checkboxes({checkboxes, setCheckbox}) {
    const {
        buttonSendOrderContext,
        setButtonSendOrderContext
    } = React.useContext(ButtonSendOrderContext);

    let emptyText = () => { "" }

    return (
        <div className={'check-container'}>
            <div onClick={emptyText}/>
            {checkboxes.map((checkbox, i) => (
                <label className={'check'} key={i}>
                    <input
                        className={`check__input`}
                        onClick={() => {}}
                        type="checkbox"
                        checked={checkbox.checked}
                        onChange={(e) => {
                            if (checkbox.name == 'Монтаж новой таблички') {
                                setButtonSendOrderContext({...buttonSendOrderContext, montagePlate: e.target.checked});
                            } else if (checkbox.name == 'Демонтаж старой таблички') {
                                setButtonSendOrderContext({
                                    ...buttonSendOrderContext,
                                    dismantlingOldPlate: e.target.checked
                                });
                            }
                            setCheckbox(i, e.target.checked);
                        }}
                    />
                    <span className={`check__box`}>
                        <span className={'mark'}/>
                    </span>{checkbox.name}
                </label>
            ))}
        </div>
    );
}

function FinalCheckbox() {
    // @ts-ignore
    const checkboxes = useCheckboxes();

    return (
        <div>
            <Checkboxes {...checkboxes} />
        </div>
    );
}

function OrderForm() {
    // @ts-ignore
    const inputNameProps = useInput();
    // @ts-ignore
    const inputCommProps = useInput();

    const [isClicked, setIsClicked] = React.useState(false);
    const [isSendMail, setIsSendMail] = React.useState(false);
    const {buttonSendOrderContext, setButtonSendOrderContext} = React.useContext(ButtonSendOrderContext);

    const sendMail = async (event) => {
        const a = await fetch('./api/request', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-type': 'text'
            },
            body: `user_data: {"type": "${buttonSendOrderContext.street.streetType}", "street_name": "${buttonSendOrderContext.street.streetName}", "customer_name": "${buttonSendOrderContext.clientName}", "number": "${buttonSendOrderContext.build}", "dismanting": ${buttonSendOrderContext.dismantlingOldPlate}, "mounting": ${buttonSendOrderContext.montagePlate}, "color-code": "${buttonSendOrderContext.color}", "communication": "${buttonSendOrderContext.clientContact}"}`
        });
    }

    const styleInfoText = {
        marginBottom: "40px",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "2.5rem",
        lineHeight: "1.4",
        color: "#FFFFFF"
    };

    function calculateFinalPrice(price: number) {
        if (buttonSendOrderContext.dismantlingOldPlate) {
            price += 2990
        }

        if (buttonSendOrderContext.montagePlate) {
            price += 6990
        }

        return price
    }

    const finalPriceStyle = {
        display: 'flex',
        padding: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        fontStyle: "normal",
        fontWeight: 400,
        color: "white",
        fontSize: "3.8rem",
        lineHeight: "1",
        margin: "5.125rem 1.25rem 0rem 0rem",
    }

    function FinalPrice() {
        return (
            <div>
                <p style={{
                    ...finalPriceStyle,
                    paddingBottom: '2rem'
                }}>
                    <span style={{fontSize: '2.5rem'}}>Общая стоимость</span>
                    <span style={{fontWeight: 700}}>{
                        ExportPrice == undefined ? calculateFinalPrice(4990)
                            : calculateFinalPrice(ExportPrice)
                    } ₽</span>
                </p>
            </div>)
    }

    function FinalPriceWithDismountingOrMounting() {
        return (
            <>
                <p style={finalPriceStyle}>
                    <span style={{fontSize: '2.5rem'}}>Общая стоимость</span>
                    <span style={{fontWeight: 700}}>до {
                        ExportPrice == undefined ? calculateFinalPrice(4990)
                            : calculateFinalPrice(ExportPrice)
                    } ₽</span>
                </p>
                <p style={{
                    fontSize: "2rem",
                    fontWeight: 300,
                    color: "white",
                    margin: "0rem 1.25rem 4rem 0rem",
                    paddingBottom: '2.5rem', //костыль, чтобы появилось пустое пространство
                }}>
                    зависит от сложности работ
                </p>
            </>)
    }

    function Text() {
        return <p style={{
            fontStyle: "normal",
            fontWeight: 400,
            display: "inline-block",
            color: "white",
            fontSize: "2.5rem",
            lineHeight: "1.4",
            textAlign: "left",
            margin: "1rem 1.25rem 5rem 0rem"
        }}>Мы свяжемся с вами и расскажем, что делать дальше
        </p>
    }

    function RenderFinalPrice(props) {
        const isMounting = props.isMounting;
        const isDismounting = props.isDismounting;

        if (isClicked) {
            return <Text/>
        }

        if (isMounting || isDismounting) {
            return <FinalPriceWithDismountingOrMounting/>
        } else {
            return <FinalPrice/>
        }
    }

    return (
        <form onSubmit={event => event.preventDefault()} className={'inputs-container'}>
                <p style={styleInfoText}>
                    Оставьте любимый способ связи.
                    <br/>
                    Мы напишем или позвоним, чтобы обсудить детали и оплату.
                </p>
                <input required={true}
                       autoComplete="none"
                       className={'StyledInput'} {...inputNameProps}
                       placeholder="Имя"
                       onChange={event => setButtonSendOrderContext({
                           ...buttonSendOrderContext,
                           clientName: event.target.value,
                       })}/>
                <input required={true}
                       className={'StyledInput'}
                       {...inputCommProps}
                       placeholder="Способ связи. Например, email"
                       autoComplete="none"
                       onChange={event => setButtonSendOrderContext({
                           ...buttonSendOrderContext,
                           clientContact: event.target.value
                       })}
                />
                <FinalCheckbox/>
                <OrderButton onClickHandler={
                    (event) => {
                        setIsClicked(true);
                        if (!isSendMail) {
                            setIsSendMail(true)
                            sendMail(event)
                                .then(_ => console.log("Email send successful"))
                                .catch(_ => console.log(`Something went wrong: ${event}`))
                        } else {
                            alert("Форма уже отправлена\nДля повтроной отправлки перезагрузите страницу")
                        }
                    }
                }/>
                <RenderFinalPrice isMounting={buttonSendOrderContext.montagePlate}
                                  isDismounting={buttonSendOrderContext.dismantlingOldPlate}/>
        </form>
    );
}

export default OrderForm;
