document.addEventListener("DOMContentLoaded", function(){
class main{
    constructor(){
        this.content= $(".content");
        this.arrowIcon= $(".arrowIcon");
        this.sortBtn= $(".content__sortBtn");
        this.input=$(".navrab__input");
        this.formBtn=$(".navrab__formBtn");
        this.articules;/*Tablica do przechowywania wszystkich artykulow ze strony*/
        this.sortBtn.bind('click',()=>this.sortFunction());
        this.formBtn.bind('click',()=>this.loadArtiuclesAccordingToDate( event ));
        this.result; /*wynik pobrania pliku JSON*/
        this.articulesCreated=false;
        this.sorted=false;
        this.url= "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        this.url+= '?' + $.param({
            'api-key': "1f9d306396d1485a90d2ab6efe21e5ea",
        });
    }
    /*funkcja pobierajaca artykuly*/
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
    /*Odswierzanie zawartosci diva z artykulami (w przypadku pobrania nowych artykulow albo ich posortowania)*/
    refreshContent(){
        let doc=this.result.response.docs;
        for(let i=0 ; i<doc.length ; i++){
            let date=this.prepareDateForArtiucles(doc[i].pub_date);
            let html=this.insertArticuleText(doc[i].snippet , doc[i].headline.main , date);
            $(this.articules[i]).html(html);
        }
    }
    /*Wstawia tekst do artykulu*/
    insertArticuleText(text,title,date){
        let html=       "<p class='articule__date'>"+date+"</p>";        
        html+=          "<h2 class='articule__title'>"+title+"</h2>";
        html+=          "<p class='articule__articuleText'>"+text+"</p>";
        return html;
    }
    /*Tworzy tyle pustych artykulow ile zostalo porabych*/
    createArticule(){
        let doc=this.result.response.docs;
        for(let i=0 ; i<doc.length ; i++){
            this.content.append("<a href='"+doc[i].web_url+"'><article class='articule'></article></a>");
        }
        this.articules=$(".articule");
        this.articulesCreated=true;
    }
    /*funkcja sortujaca artykuly po datach*/
    sortFunction(){
        this.arrowRotation();
        if(this.sorted){
            this.result.response.docs.reverse();
        }
        else{
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
    /*Funkcja pobiera artykuly zgodnie z podanymi przez urzytkownika datami*/
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
    /*Obracanie starzalki po nacisnieciu przycisku sortowania*/
    arrowRotation(){
        let className =(this.arrowIcon.attr("class")=="arrowIcon fa fa-arrow-down")?"arrowIcon fa fa-arrow-up":"arrowIcon fa fa-arrow-down";
        this.arrowIcon.removeClass();
        this.arrowIcon.addClass(className);
    }
    /*Przygotowywanie daty do wyswietlenia przy artykule*/
    prepareDateForArtiucles(date){
        return date.substr(0,19).split('T').join(" ");
    }
    /*Przygotowywanie daty do wyslania z zapytaniem XML*/
    prepareDateForURL(date){
        return date.split('-').join('');
    }
}
let object1 = new main();
object1.uploadArticules();
});