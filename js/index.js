document.addEventListener("DOMContentLoaded", function(){
class main{
    constructor(){
        this.content= $(".content");
        this.arrowIcon= $(".arrowIcon");
        this.sortBtn= $(".content__sortBtn");
        this.input=$(".navrab__input");
        this.formBtn=$(".navrab__formBtn");
        this.sortBtn.bind('click',()=>this.sortFunction());
        this.formBtn.bind('click',()=>this.loadArtiuclesAccordingToDate( event ));
        this.result;
        this.articulesCreated=false;
        this.articules;
        this.sorted=false;
        this.url= "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        this.url+= '?' + $.param({
            'api-key': "1f9d306396d1485a90d2ab6efe21e5ea",
        });
    }
    uploadArticules(){
        $.ajax({
            url: this.url,
            method: 'GET',
        }).done((result)=>{
            this.result=result;
            (this.articulesCreated)?'':this.createArticule();
            this.refreshContent();
        }).fail((err)=>{
            throw err;
        });
    }
    refreshContent(){
        let doc=this.result.response.docs;
        for(let i=0 ; i<doc.length ; i++){
            let date=this.prepareDateForArtiucles(doc[i].pub_date);
            let html=this.insertArticuleText(doc[i].snippet , doc[i].headline.main , date);
            $(this.articules[i]).html(html);
        }
    }
    insertArticuleText(text,title,date){
        let html=       "<p class='articule__date'>"+date+"</p>";        
        html+=          "<h2 class='articule__title'>"+title+"</h2>";
        html+=          "<p class='articule__articuleText'>"+text+"</p>";
        return html;
    }
    createArticule(){
        let doc=this.result.response.docs;
        for(let i=0 ; i<doc.length ; i++){
            this.content.append("<a href='"+doc[i].web_url+"'><article class='articule'></article></a>");
        }
        this.articules=$(".articule");
        this.articulesCreated=true;
    }
    sortFunction(){//funkcja sortujaca artykuly
        this.arrowRotation();
        if(this.sorted){//odwracanie posortowanych artykolow
            this.result.response.docs.reverse();
        }
        else{//sortowanie artykolow wedlog daty
            let doc=this.result.response.docs;
            for (var j=0 ; j<doc.length-1 ; j++){
                for(var i=0 ; i<doc.length-1 ; i++){
                    if(doc[i].pub_date>doc[i+1].pub_date){
                        var x=this.result.response.docs[i];
                        this.result.response.docs[i]=this.result.response.docs[i+1];
                        this.result.response.docs[i+1]=x;
                    }
                }
            }
            this.sorted=true;
        }
        this.refreshContent();
    }
    loadArtiuclesAccordingToDate(event){
        event.preventDefault();
        let begDate=this.prepareDateForURL(this.input[0].value);
        let endDate=this.prepareDateForURL(this.input[1].value);
        this.url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        this.url += '?' + $.param({
            'api-key': "1f9d306396d1485a90d2ab6efe21e5ea",
            'begin_date': begDate,
            'end_date': endDate
        });
        ((begDate!="")&&(endDate!=""))?this.uploadArticules():'';
    }
    arrowRotation(){//obrot ikonki szczalki na przycisku sortowania
        let className =(this.arrowIcon.attr("class")=="arrowIcon fa fa-arrow-down")?"arrowIcon fa fa-arrow-up":"arrowIcon fa fa-arrow-down";
        this.arrowIcon.removeClass();
        this.arrowIcon.addClass(className);
    }
    prepareDateForArtiucles(date){
        return date.substr(0,19).split('T').join(" ");
    }
    prepareDateForURL(date){
        return date.split('-').join('');
    }
}
let object1 = new main();
object1.uploadArticules();
});