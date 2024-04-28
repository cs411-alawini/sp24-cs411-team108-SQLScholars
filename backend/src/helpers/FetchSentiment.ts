import axios from 'axios';
class FetchSentiment{
    constructor(){}

    static async fetchSentiment(text: string){
        return new Promise((resolve, reject)=>{
            axios.get(`http://34.28.45.203/predict?text=${encodeURIComponent(text)}`)
            .then((response)=>{
                resolve(response.data);
            })
        });
    }
}
export default FetchSentiment;