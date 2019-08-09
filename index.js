import axios from "axios";
import { parseString  } from 'react-native-xml2js';

class AxiosSoap {
    static xmlStart='<x:Envelope xmlns:x="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tme="http://tmeappuri.org/">';
    static xmlEnd='</x:Envelope>';
    static xml='';
    static header='';
    static body='';




    static isObject = function(a) {
        return (!!a) && (a.constructor === Object);
    };
    static createObjectElement(element){
        let header = '';
        for (let ind in element) {
            let data = element[ind];
            if (this.isObject(data)){
                header+="<"+ind+">";
                header+=this.createObjectElement(data);
                header+="</"+ind+">";
            }else {
                header+="<"+ind+">"+data+"</"+ind+">";
            }
        }
        return header
    }


    static createBody(bodyData,bodyType='x:Body'){
        let body = '';
        body+="<"+bodyType+">";
        for (let ind in bodyData) {
            let data = bodyData[ind];
            if (this.isObject(data)){
                body+="<"+ind+">";
                body+=this.createObjectElement(data);
                body+="</"+ind+">";
            }else {
                body+="<"+ind+">"+data+"</"+ind+">";
            }
        }
        body+="</"+bodyType+">";
        this.body=body
    }
    static createHeader(headerData,headerType='x:Header'){
        let header = '';
        header+="<"+headerType+">";
        for (let ind in headerData) {
            let data = headerData[ind];
            if (this.isObject(data)){
                header+="<"+ind+">";
                header+=this.createObjectElement(data);
                header+="</"+ind+">";
            }else {
                header+="<"+ind+">"+data+"</"+ind+">";
            }
        }
        header+="</"+headerType+">";
        this.header=header
    }


    static makeRequest(url){
        this.xml=this.xmlStart+this.header+this.body+this.xmlEnd;
        var data =axios.post(url,
            this.xml,
            {headers:
                    {'Content-Type': 'text/xml'}
            }).then(res=>{

            var cleanedString = res.data.replace("\ufeff", "");
                var finalData;
            parseString(cleanedString,{trim: true}, (err, result) => {
                if (err) {
                    throw (err);
                }
                finalData=result;

            });
            return finalData
        }).catch(err=>{return err});
        return data
    }

}
export default AxiosSoap
