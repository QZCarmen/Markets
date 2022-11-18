
$(document).ready(function () {
  
    var faunadb = window.faunadb;
    var q = faunadb.query;
    var client = new faunadb.Client({
        secret: 'fnAE0WnTguAATXwpxfX-ihF-aiYRMw8FJ9I_0nxl',
        // Adjust the endpoint if you are using Region Groups
        endpoint: 'https://db.us.fauna.com',
    });

    //get user info
    var username = localStorage.getItem('username');
    var profile =localStorage.getItem("profile");
   
    var user_events=[];
    var sort_events=[];
    var flag = false;
    if(username!=null){
        $(".menu").html(generateMenu(username));//set up user menu
        
        client.query([
            q.Map(
                q.Paginate(q.Documents(q.Collection('User_Event'))),
                q.Lambda(x => q.Get(x))
            )
        
        ]).then(function (res) {
            for(var i=0;i<res[0]["data"].length;i++){
                var data =res[0]["data"][i]["data"];
                if(data["username"] == username){
                     user_events.push(data["event"]);
                }
             }
             readEvents(client,q,user_events,username,profile,sort_events);
        });
    }else{
        readEvents(client,q,[],username,profile,sort_events);
    }
    $(".sort").click(function(){
        $(".events").html("");
        var sort = $(this).text();
        if(sort=="A-Z"){
            sort_events.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 
        }else if (sort=="Latest"){
            sort_events.sort((a,b) => a.time - b.time); 
        }else if(sort == "Oldest"){
            sort_events.sort((a,b) => b.time - a.time); 
        }
        for(var  i=0;i<sort_events.length;i++){
            var data=sort_events[i];
            var found =false;
            for(var j=0;j<user_events.length;j++){
                if(data["id"]==user_events[j]["id"]){
                    found=true;
                }
             }
             $(".events").append(generateView(data["ref"],data["fee"],data["date"],data["month"],data["year"],data["start"],data["end"],data["pic"],data["name"],data["id"],data["location"],data["description"],username,found,true,profile,''));
        }});

    
    

    $(document).on('click','.btn_terms',function(){
        
        var id = $(this).attr("id");
        id = parseInt(id.replace("btn_terms_",""));
        var form =$("#form"+id);
     
        if($(form)[0].checkValidity() === true){
                var event = getEventById(id);
                client.query(
                    q.Create(
                    q.Collection('User_Event'),
                    { data: { event: event,username:username } },
                    )
                )
                .then((ret) => console.log(ret));
                //close current modal
                $("#terms_"+id).modal("hide");
                $("#successfulMsg").modal("show");
        }else{
            alert("Please confirm that your have read the terms");
        }

    });
   

});






    //on submit


function readEvents(client,q,user_events,username,profile,sort_events){
    client.query([
        q.Map(
            q.Paginate(q.Documents(q.Collection('Events'))),
            q.Lambda(x => q.Get(x))
          )
      
      ]).then(function (res) { 
        console.log('Result:', res);
      
        for(var i=0;i<res[0]["data"].length;i++){
            var data =res[0]["data"][i]["data"];
            var ref = res[0]["data"][i]["ref"]["value"]["id"];
            var found = false;
            var time = data["year"]+"-"+data["month"]+"-"+data["date"];
            var date= new Date(time);
            data["time"]=date;
            data["ref"] = ref;
            sort_events.push(data);
             for(var j=0;j<user_events.length;j++){
                if(data["id"]==user_events[j]["id"]){
                    found=true;
                }
             }
             $(".events").append(generateView(ref,data["fee"],data["date"],data["month"],data["year"],data["start"],data["end"],data["pic"],data["name"],data["id"],data["location"],data["description"],username,found,true,profile,''));
             if(!found){
                 $(".terms").append(generateTermsModal(data["name"],data["id"],data["terms"],username));
             }
        }
    })
    .catch(function (err) { console.log('Error:', err) });
}




