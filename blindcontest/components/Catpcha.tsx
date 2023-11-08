import WebView from "react-native-webview";
import recaptchaHtml from "../helpers/recaptcha-html";
import verifyCaptcha from "../helpers/verify-captcha";

export default function Captcha() {
    const onCheck = async (token: string) => {
        // console.log(token);
        const check = await verifyCaptcha(token);
        console.log(check);
        
    }
    
    return (
        <WebView
            originWhitelist={["*"]}
            style={{ width: 0, height: 0 }}
            startInLoadingState
            javaScriptEnabledAndroid
            javaScriptEnabled
            source={{ html: recaptchaHtml, baseUrl: "blindcontest.com" }}
            onMessage={(event: any) => onCheck(event.nativeEvent.data)}
        />
    );
}