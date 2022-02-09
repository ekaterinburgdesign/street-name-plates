import React, {useState} from "react";
import {ButtonSendOrderContext} from "./OrderForm";

export let IsPressedButton = false

const OrderButton = ({onClickHandler}) => {
    let [style, setStyle] = useState("OrderButton")
    let [val, setVal] = useState("Оформить заявку на табличку")
    let [className, setClassName] = useState("")
    const buttonSendOrderContext = React.useContext(ButtonSendOrderContext);

    function animationButton(func) {
        return function () {
            if (buttonSendOrderContext.buttonSendOrderContext.clientContact && buttonSendOrderContext.buttonSendOrderContext.clientName) {
                setStyle("OrderButtonAnimation")
                setVal("Спасибо!")
                setClassName("StyledSubmitButton")
                IsPressedButton = true
                return func.apply(this, arguments)
            }
        }
    }

    return (
        <div className={style}>
        <span style={{
            backgroundColor: 'black',
            position: 'absolute',
            borderRadius: 'inherit',
            height: '100%',
            width: '100%'
        }}>
            <input
                type={"submit"}
                onClick={animationButton(onClickHandler)}
                value={val} className={className}
                style={{backgroundColor:'#1d1e1f'}}
            />
        </span>
        </div>
    );
};

export default OrderButton;
