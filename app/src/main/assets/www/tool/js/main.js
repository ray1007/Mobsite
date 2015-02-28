jQuery(document).ready(function($){
    openDeployDialog();
});

function openDeployDialog(){

    var GHUserPageMsg = "* This will create a new repository \"&lt;username&gt;.github.io\".<br/>If repo already existed, the repository will be overwritten.";
    var GHProjectPageMsg = "* You will be asked to choose a project repository<br/>and this will create a new branch \"gh-pages\" in that.<br/>If branch already existed, it will be overwritten.";
    var GHisUserPage = true;

    // start query elements of the website DOM.
    var GHLoginDialog      = document.getElementById("GHDialogLogin");
    var GHMsg         = document.getElementById("GHMsg");
    var GHErr         = document.getElementById("ErrMsg");
    var cancelBtn   = document.getElementById("GHCancelBtn");
    var loginBtn    = document.getElementById("GHLoginBtn");
    var GHloadCircle  = document.getElementById("loadCircle");
    var GHUsernameInput    = document.getElementById("GHUsrIn");
    var GHPasswordInput    = document.getElementById("GHPasIn");
    var GHTypeSwitch  = document.getElementById("myonoffswitch");
    
    var GHSelectDialog      = document.getElementById("GHSelectDialog");
    var GHRepoList  = document.getElementById("GHRepoList");
    var GHloadCircle2  = document.getElementById("loadCircle2");
    var selectBtn    = document.getElementById("GHSelectRepoBtn");
    var backBtn    = document.getElementById("GHBackBtn");
    var GHErr2         = document.getElementById("ErrMsg2");
    var GHNewRepoNameInput    = document.getElementById("GHNewRepoNameIn");
    
    var github;
    var GHUser;
    
    var GHselectdRepoIndex = -1;
    GHMsg.innerHTML = GHUserPageMsg;

    // set listeners.
    loginBtn.addEventListener("click", onClickLogin, false);
    cancelBtn.addEventListener("click", onClickCancel, false);
    backBtn.addEventListener("click", onClickBack, false);
    GHTypeSwitch.addEventListener("click", onPageSwitch, false);
    GHRepoList.addEventListener("click", onItemSelect, false);
    
    // below are functions.
    function onPageSwitch(){
        GHisUserPage = GHTypeSwitch.checked;
        if(GHisUserPage)
            GHMsg.innerHTML = GHUserPageMsg;
        else 
            GHMsg.innerHTML = GHProjectPageMsg;
    }
    
    function onClickCancel(){
        console.log("cancel");
        editor.shadowFade();
    }

    function onClickLogin(){
        GHErr.innerHTML = "";
        if(!validateDialogInput()){
            return;
        }
        try{
        loginGH();
        }catch (err) {console.log(err.message);}
    }
    
    function onClickBack(){
        selectDialogPage(1);
    }
    
    function onItemSelect(event){
        if(event.target){
            GHselectdRepoIndex = 0;
            var prev = event.target.previousSibling;
            while(prev != null){
                prev = prev.previousSibling;
                GHselectdRepoIndex++;
            }
            console.log("list # "+GHselectdRepoIndex);
        }
    }
    
    function validateDialogInput(){
        var clean = true;
        var errString   = "";
        
        if(GHUsernameInput.value == "" || GHUsernameInput.value == null){
            errString += "* Username is empty.";
            clean = false;
        }
        if(GHPasswordInput.value == "" || GHPasswordInput.value == null){
            errString += "* Password is empty. ";
            clean = false;
        }
        GHErr.innerHTML = errString;
        return clean;
    }
    
    function loginGH(){
        // set up the loading circle.
        GHloadCircle.style.visibility = "visible";
        
        // begin login work.
        var usernameString = GHUsernameInput.value; 
        var passwordString = GHPasswordInput.value;

        // TODO 
        usernameString = 'ray1007';
        passwordString = 'Needtocode007';
        
        github = new Github({
            username: usernameString,
            password: passwordString,
            auth: "basic"
        });
        GHUser = github.getUser();
        console.log("GH login.");
        // validate user.
        GHUser.show(usernameString, function(err, user) {
            console.log("GH login 2.");
            if(user == null){
                // login fail.
                GHErr.innerHTML = "* Login Fail. Please check username/password<br>or internet.";
                GHloadCircle.style.visibility = "hidden";
                return;
            }
            console.log(user);
            // login success, the user instance is valid.
            Android.showProgressDialog("Deploying project", "initializing...");
            if(GHisUserPage){
                var GHRepoName = usernameString + ".github.io";
                var IOrepo = github.getRepo(usernameString, GHRepoName);
                IOrepo.show(function(err, repo) { 
                    if(repo == null){
                        createRepoAndWriteFile(GHUser, IOrepo, GHRepoName);
                    }else{
                        IOrepo.deleteRepo(function(err, res) {
                            var IOrepo = github.getRepo(usernameString, GHRepoName);
                            createRepoAndWriteFile(GHUser, IOrepo, GHRepoName);
                        });
                    }
                });
            } else {
                GHUser.repos(function(err, repos) {
                    for(var i in repos){
                        if(repos[i].name != usernameString+".github.io"){
                            GHRepoList.innerHTML += "<option class=\"list-group-item\">" +
                                                    repos[i].name + "</option>";
                            console.log("GH REPOS "+repos[i].name);
                        }
                    }
                    selectDialogPage(2);
                });
            }
        });
    }
    
    function createRepoAndWriteFile(myUser, myRepo, repoName){
        var branchName = "master";
        myUser.createRepo({"name": repoName}, function(err, res) {

            // deploy "index.html"
            myRepo.write(branchName,
                         'index.html', // file path + name.
                         btoa(unescape(encodeURIComponent(genInnerContentHTML()))), // file content.
                         'Generated by MOBSITE, '+new Date().toDateString(), // commit message.
                         function(err) {}
            );            
            
            // Get all the files through Android Javascript Interface.
            var files = JSON.parse(Android.getProjectsPathJSON());
            var omitLen = Android.getProjectPath().length+1;
            
            deployFiles(files, omitLen, files.length);

            function deployFiles(files, omitLen, fileNum){
                if(files.length == 0){
                    Android.dismissPDialog()
                    GHloadCircle.style.visibility = "hidden";
                    editor.githubPanelHide();
                    return;
                }
                    
                console.log("deploy with "+files.length+" files. Currently at "+files.length);
                
                console.log(files.length+" : "+files[0].path);
                var request = new XMLHttpRequest();
                request.open("GET", files[0].path, true);
                request.responseType = 'arraybuffer';
                request.timeout = 2000;
                //request.myIdx = 0;
                request.myPath = JSON.parse(JSON.stringify(files[0].path.substring(omitLen)));
                //status[idx].working = true;
                request.onload = function(){
                    var uInt8Array = new Uint8Array(this.response);
                    //console.log("RESPONSE OF "+this.myIdx+" "+this.myPath);
                    var i = uInt8Array.length;
                    var binaryString = new Array(i);
                    while (i--) {
                       binaryString[i] = String.fromCharCode(uInt8Array[i]);
                    }
                    var data = binaryString.join('');
                    var base64 = window.btoa(data);
                    //var targetIdx = this.myIdx;
                    var targetPath = this.myPath;
                    console.log("onload of "+targetPath);
                    myRepo.write(branchName,
                                 this.myPath, // file path + name.
                                 base64, // file content.
                                 'Generated by MOBSITE, '+new Date().toDateString(), // commit message.
                                 function(err) {
                                     //runner++;
                                     //status[targetIdx].working = false;
                                     if(err){
                                         console.log("there is error at "+files.length+", redo.");
                                         deployFiles(files, omitLen);
                                     }else{
                                         //status[targetIdx].success = true;
                                         //successCount++;
                                         //console.log("success count : "+successCount);
                                         console.log("success at index : "+files.length);
                                         files.splice(0, 1);
                                         Android.showPDialogMsg("Uploaded files ("+(fileNum-files.length)+"/"+fileNum+")...");
                                         deployFiles(files, omitLen, fileNum);
                                     }
                                 }
                    );
                }
                request.send();
            }
        });
        
    }
    
    selectBtn.addEventListener("click", onClickSelect, false);
    
    
    
    function onClickSelect(){
        GHErr2.innerHTML = "";
        if(GHNewRepoNameInput.value == GHUsernameInput.value+".github.io"){
            GHErr2.innerHTML = "* Please go back and select \"User Page\" then.";
            return;
        }
        if(GHNewRepoNameInput.value != ""){
            var Newrepo = GHUser.getRepo(GHUsernameInput.value, GHNewRepoNameInput.value);
            Newrepo.show(function(err, repo) {
                createRepoAndWriteFile(GHUsernameInput.value, Newrepo, GHNewRepoNameInput.value);
            });
            return;
        }
        if(GHselectdRepoIndex == -1){
            GHErr2.innerHTML = "* Please select a repo or enter a new repo name.";
            return;
        }
        var reposelect = GHRepoList.childNodes[GHselectdRepoIndex].innerHTML;
        console.log(reposelect);
        var Repo = github.getRepo(GHUsernameInput.value, reposelect);
        /*Repo.show(function(err, repo) {
            console.log(repo);
        });*/
        console.log("GH get repos.");
        getRepoAndWriteFile(GHUser, Repo, reposelect);
        
    }
    
    function getRepoAndWriteFile(myUser, myRepo, repoName){
        var branchName = "gh-pages";    
        console.log("where");
        myRepo.deleteRef('heads/gh-pages', function(err) {});
        myRepo.branch(branchName, function(err) {
            myRepo.write(branchName, 
                     'README2.md', // file path + name.
                     'sYOUR_NEW_CONTENTS2', // file content.
                     'Generated by MOBSITE, '+new Date().toDateString(), // commit message.
                     function(err) {
                        // completed deploy task!
                        dismissDialogs();
                     });
        });
    }
    
    function selectDialogPage(pageNum){
        switch(pageNum){
            case 1:
                GHLoginDialog.style.visibility="visible";
                GHSelectDialog.style.left="200%";
                if(GHloadCircle2.style.visibility == "visible"){
                    GHloadCircle2.style.visibility = "hidden";
                    GHloadCircle.style.visibility="visible";

                }      
                break;
            case 2:
                GHLoginDialog.style.visibility="hidden";
                GHSelectDialog.style.left="0%";
                if(GHloadCircle.style.visibility == "visible"){
                    GHloadCircle.style.visibility = "hidden";
                    GHloadCircle2.style.visibility="visible";

                }      
                break;
        }
    }

    function dismissDialogs(){
        /*switch(pageNum){
            case 1:
                GHLoginDialog.style.visibility="hidden";
                GHloadCircle.style.visibility = "hidden";
                break;
            case 2:
                GHSelectDialog.style.left="100%";
                GHloadCircle2.style.visibility = "hidden";
                break;
        }*/
    }
    
    // perform some pre-execution of "index.html"
    function genInnerContentHTML(){
        var head = document.createElement('head');
        var elem;
        elem = document.createElement('meta');
        elem.setAttribute('charset', 'utf-8');
        head.appendChild(elem);
        elem = document.createElement('meta');
        elem.setAttribute('name', 'viewport');
        elem.setAttribute('content', 'width=device-width, initial-scale=1');
        head.appendChild(elem);
        elem = document.createElement('title');
        elem.innerHTML = Android.getProjectName();
        head.appendChild(elem);
        elem = document.createElement('link');
        elem.setAttribute("href", "css/bootstrap.min.css");
        head.appendChild(elem);
            
        var inner  = document.getElementById("innercontent");
        inner.removeChild(inner.lastElementChild);

        var code = "<!DOCTYPE html>\n"+
                   "<html>\n"+
                   "<head>\n"+
                   "    "+head.innerHTML+
                   "\n</head>\n"+
                   "<body>\n"+
                   inner.innerHTML+
                   "\n</body>\n"+
                   "</html>"
        ;
        //console.log(code);
        return code;
    }
}