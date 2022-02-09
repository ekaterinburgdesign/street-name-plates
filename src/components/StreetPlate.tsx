import React from 'react';
import {ChangeColorContext} from "./ChangeColor";
import Style from '../styles/StreetPlate.module.css'
import {ButtonSendOrderContext} from "./OrderForm";

export type StreetType = {
    streetName: string,
    streetType: string,
    streetLatin: string
}

export const defaultPlateLength = '1300мм';
export let ExportPrice;

const StreetPlate = () => {
    const [isFind, setIsFind] = React.useState(false);
    const [isShow, setIsShow] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<StreetType[]>([]);
    const [inputVal, setInputVal] = React.useState<string>();
    const [inputPref, setInputPref] = React.useState<string>();
    const [latinName, setLatinName] = React.useState<string>();
    const [streetType, setStreetType] = React.useState<string>();
    const [savedInnerHtml, setSavedInnerHtml] = React.useState<string>();
    const [isHistory, setIsHistory] = React.useState(false);
    const [buildNumber, setBuildNumber] = React.useState<string>();
    const [plateWidthPX, setPlateWidthPX] = React.useState('14.0625rem');
    const [plateLengthSize, setPlateLengthSize] = React.useState('1300мм');
    const [platePrice, setPlatePrice] = React.useState(4990)
    const [fontSizeBuildingNumber, setFontSizeBuildingNumber] = React.useState('0.75em');
    const [fontSizeStreetName, setFontSizeStreetName] = React.useState('0.45em');
    const [indexActiveSuggestion, setIndexActiveSuggestion] = React.useState(0);

    const {colorContext} = React.useContext(ChangeColorContext);
    const {buttonSendOrderContext, setButtonSendOrderContext} = React.useContext(ButtonSendOrderContext);

    const changePlateLengthSize = (lengthStreetName: number) => {
        if (fontSizeStreetName != '0.45em'){
            setFontSizeStreetName('0.45em');
        }

        if (lengthStreetName <= 8) {
            setPlateLengthSize('1300мм');
            setPlateWidthPX('14.0625rem');
            setPlatePrice(4990);
            ExportPrice = 4990;
            //изменение в самую маленькую табличку
        } else if (lengthStreetName >= 9 && lengthStreetName <= 13) {
            setPlateLengthSize('1700мм');
            setPlateWidthPX('11.25rem');
            setPlatePrice(7990);
            ExportPrice = 7990;
            //изменение в среднюю табличку
        } else if (lengthStreetName >= 14) {
            setPlateLengthSize('2050мм');
            setPlateWidthPX('9.375rem');
            setPlatePrice(11990);
            ExportPrice = 11990;
            //изменение в сааамую большую табличку

            if (lengthStreetName > 15){
                setFontSizeStreetName('0.33em');
            }
            if (lengthStreetName > 19){
                setFontSizeStreetName('0.25em');
            }
        }

        setButtonSendOrderContext({...buttonSendOrderContext, plateLength: plateLengthSize, platePrice: platePrice})
    }

    const findSuggestions = async (event: React.ChangeEvent<HTMLInputElement>) => { //вообще, фильтрация же будет осуществляться на беке, значит тут нужен просто запрос
        setInputVal(undefined); // костыль... (наверное)
        setStreetType('');
        setLatinName('');
        setIsHistory(false);

        const value: string = event.target.value || '';
        changePlateLengthSize(value.length);
        const maximumSuggestions = 5;
        let streets = await (await fetch( `./api/autocomplete?street=${value}&maximumSuggestions=${maximumSuggestions}`)).json();


        const newSuggestions = streets.hasOwnProperty('streets') ? streets.streets.map(s => {
            const res: StreetType = {
                streetName: s.street,
                streetType: s.type,
                streetLatin: s.english_name
            };
            return res
        }) : [];

        setSuggestions(newSuggestions);

        if (value.length != 0 && newSuggestions.length > 0) {
            setInputPref(value);
            setIndexActiveSuggestion(0);
            setIsFind(true);
        } else {
            setIsFind(false);
        }
    }

    const checkHistory = async (bNum: string, sName: string, sType: string ) => {
        const h = await (await fetch(`./api/info?street=${sName}&building=${bNum}&type=${sType}`)).json();
        const isH = h.hasOwnProperty('is_hist') ? h.is_hist : false;
        setIsHistory(isH);
    }

    const getSuggestion = (suggestion: StreetType) => {
        const pref = suggestion.streetName.slice(0, inputPref?.length);
        const suf = suggestion.streetName.slice(inputPref?.length);

        return (
            <React.Fragment>
                <span className={Style.suggestion_part}>{suggestion.streetType}</span> <span
                key={suggestion.streetName + suggestion.streetType}
                className={Style.suggestion_pref}>{pref}
            </span><span className={Style.suggestion_part}>{suf}</span>
            </React.Fragment>
        )
    }

    const setStreet = async (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const streetName = event.currentTarget.innerText.split(' ').slice(1).join(' ');

        const sug = suggestions.filter(suggestion => suggestion.streetName.toUpperCase() == streetName.toUpperCase())[0];
        changePlateLengthSize(sug.streetName.length);
        setInputVal(sug.streetName);
        setLatinName(sug.streetLatin);
        setStreetType(sug.streetType);
        setIsFind(false);
        await checkHistory(buildNumber, sug.streetName, sug.streetType);

        setButtonSendOrderContext({
            ...buttonSendOrderContext, street: sug
        });

    }

    const navOnSuggestion = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const key = event.key || '';

        if (!isFind) {
            return;
        }

        if (key == 'ArrowDown') {
            const newIndex = indexActiveSuggestion + 1;
            if (newIndex >= suggestions.length) {
                setIndexActiveSuggestion(0)
            } else {
                setIndexActiveSuggestion(newIndex)
            }
        } else if (key == 'ArrowUp') {
            const newIndex = indexActiveSuggestion - 1;
            if (newIndex < 0) {
                setIndexActiveSuggestion(suggestions.length - 1)
            } else {
                setIndexActiveSuggestion(newIndex)
            }
        } else if (key == 'Enter') {
            const sug = suggestions[indexActiveSuggestion];
            changePlateLengthSize(sug.streetName.length);
            setInputVal(sug.streetName);
            setLatinName(sug.streetLatin);
            setStreetType(sug.streetType);
            setIsFind(false);
            checkHistory(buildNumber, sug.streetName, sug.streetType);

            setButtonSendOrderContext({
                ...buttonSendOrderContext, street: sug
            });
        }
    }

    const renderSuggestion = () => {
        return (
            <ul className={Style.suggestions}>
                {suggestions.map((suggestion, index) => (
                    <li key={suggestion.streetName + suggestion.streetType}>
                        <span
                            className={index != indexActiveSuggestion ? Style.suggestion : Style.suggestion_active}
                            onClick={setStreet}
                            onMouseEnter={event => {
                                const sug = event.currentTarget.innerText;
                                setSavedInnerHtml(event.currentTarget.innerHTML);
                                event.currentTarget.innerText = sug;
                            }}
                            onMouseLeave={event => {
                                // @ts-ignore
                                event.currentTarget.innerHTML = savedInnerHtml;
                            }}
                        >
                        {getSuggestion(suggestion)}
                    </span>
                    </li>
                ))}
            </ul>
        )
    }

    const adjustFrontSize = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        setBuildNumber(val);
        setButtonSendOrderContext({...buttonSendOrderContext, build: val});

        if (val.length == 1) {
            setFontSizeBuildingNumber('0.75em');
        } else if (val.length == 2){
            setFontSizeBuildingNumber('0.55em')
        } else if (val.length == 3) {
            setFontSizeBuildingNumber('0.36em');
        } else if (val.length == 4) {
            setFontSizeBuildingNumber('0.27em');
        } else if (val.length == 5) {
            setFontSizeBuildingNumber('0.22em');
        } else if (val.length > 5) {
            setFontSizeBuildingNumber('0.20em');
        }
    }

    return (
        <div className={Style.plate_container} /*@ts-ignore*/ style={{
            '--font-color': isHistory ? '#FFFFFF' : colorContext.fontColor,
            '--text-align-input' : isHistory ? 'center' : 'left',
            '--plate-color' : isHistory ? '#000000' : '#FFFFFF'
        }}>
            <div className={Style.plate} style={{maxWidth: '900px', height: plateWidthPX, fontSize: plateWidthPX}}>
                <div className={Style.street}>
                    <input
                        className={Style.street_type}
                        value={streetType}
                        readOnly={true}
                        placeholder={'улица'}
                        tabIndex={-1}
                        style={{cursor: 'default'}}
                    />
                    <input
                        className={Style.street_name}
                        type={'text'}
                        onFocus={() => setIsShow(true)}
                        onBlur={() => setIsShow(false)}
                        onChange={findSuggestions}
                        onKeyDown={navOnSuggestion}
                        value={inputVal}
                        placeholder={'8 Марта'}
                        style={{fontSize: fontSizeStreetName, cursor: 'text'}}

                    />
                    <input
                        className={Style.street_latin}
                        value={latinName}
                        readOnly={true}
                        placeholder={'8 MARTA STREET'}
                        tabIndex={-1}
                        style={{cursor: 'default'}}
                    />
                    {isShow && isFind && renderSuggestion()} {/*пока пускай будет тут, или навсегда будет тут...*/}
                </div>
                <div className={Style.separator}/>
                    <input
                        type={'text'}
                        className={Style.building_number}
                        placeholder={'7'}
                        onChange={event => {
                            adjustFrontSize(event);
                            checkHistory(event.target.value, inputVal, streetType);
                        }}
                        style={{fontSize: fontSizeBuildingNumber, cursor: 'text'}}
                    />
            </div>
            <div className={Style.size_and_price_container}>
                <span className={Style.plate_length_size}>320×{plateLengthSize}</span>
                <span className={Style.price}>{platePrice} ₽</span>
            </div>
            {isHistory && (<p className={Style.is_history_description}>Поздравляем, у Вас историческое здание!</p>)}
        </div>
    )
};

export default StreetPlate;
