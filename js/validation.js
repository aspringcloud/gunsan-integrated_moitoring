var server_URL = "https://test.aspringcloud.com/api/"; //"https://api.aspringcloud.com/api/";
/* Input validation of login page */
function login_validation() {
    var email_error = document.getElementById("name_error");
    var pwd_error = document.getElementById("pwd_error");
    var credential_error = document.getElementById("incorrect_credentials");
    var input_email = $("#input_id").val();
    var input_pwd = $("#input_pwd").val();
    email_error.innerHTML = "";
    pwd_error.innerHTML = "";
    credential_error.innerHTML = "";
    localStorage.setItem('activeUserID', input_email);

    if (!inputLengthCheck(input_email, email_error, "이메일 아이디를 입력해 주세요") && !inputLengthCheck(input_pwd, pwd_error, "비밀번호를 다시 확인 해주세요"))
        return false;
    if (!inputLengthCheck(input_pwd, pwd_error, "비밀번호를 입력해 주세요"))
        return false;
    if (!inputEmailCheck(input_email, email_error, "이메일 아이디가 이메일 형식이 아닙니다"))
        return false;
    var data = JSON.stringify({
        "email": input_email,
        "password": input_pwd,
    });
    var api_url = server_URL + "auth/login/";
    postMethod(data, api_url, function (request) {
        if(request.status == 200) 
        { 
            localStorage.setItem('userId', input_email);
            localStorage.setItem('userPwd', input_pwd);
            saveID_localstorage();
            // store map id for toggle
            window.location.href = "main.html";
        }
        else 
        {
            credential_error.innerHTML = "일치하는 사용자가 없습니다. <br> 이메일 또는 비밀번호를 확인해 주세요.";
        }
        console.log("Login status: " +request.status);
    });
}

function openLoginPage() {
    window.location.href = "index.html";
}

function backArrow(id) 
{
    if (id == "page2") 
    {
        window.location.href = "index.html";
    }
    else if (id == "page3") 
    {
        document.getElementById('FindId_div2').style.display = 'none';
        document.getElementById('FindId_div1').style.display = 'block';
        document.getElementById('page3').id = "page2";
    }
}

// Validation for Find_id page 
// For explanation of regex - https://blog.jaeyoon.io/2017/10/js-regex.html 
function findid_validation(button_id) {
    var input_name_error = document.getElementById('input_name_error');
    var input_email_error = document.getElementById('input_email_error');
    input_name_error.innerHTML = "";
    input_email_error.innerHTML = "";
    var input_name = $("#input_name").val();
    var input_email = $("#input_email").val();
    if (!inputLengthCheck(input_name, input_name_error, "이름을 입력해 주세요.") && !inputLengthCheck(input_email, input_email_error, "이메일 아이디를 입력해 주세요."))
        return false;
    if (!inputLengthCheck(input_name, input_name_error, "이름을 입력해 주세요."))
        return false;
    if (!inputLengthCheck(input_email, input_email_error, "이메일 아이디를 입력해 주세요."))
        return false;
    if (!inputEmailCheck(input_email, input_email_error, "이메일 아이디가 이메일 형식이 아닙니다."))
        return false;

    var postdata = JSON.stringify({
        "email": input_email,
    });
    var api_url = server_URL +"users/resetpassword/";
    postMethod(postdata, api_url, function (status_code) 
    {
        if (status_code == 200) 
        {
            document.getElementById('id_email_p').innerHTML = input_email;
            document.getElementById('id_pwd_p').innerHTML = "임시 비밀번호가 발송되었습니다.";
            document.getElementById('FindId_div1').style.display = 'none';
            document.getElementById('FindId_div2').style.display = 'block';
            document.getElementById('page2').id = "page3";
        } 
        else 
        {
            input_email_error.innerHTML = " 일치하는 사용자가 없습니다. <br> 이름 또는 이메일 아이디를 확인해 주세요.​";
        }
        console.log("Login status: " + status_code);
    });
    return false;
}

function sendEmailAPI(postdata) {
    var api_url = server_URL +"users/sendmessage/";
    postMethod(postdata, api_url, function (status_code) 
    {
        if (status_code == 200)
        {
            document.getElementById('messageSendStatus').innerHTML = "메시지를 보냈습니다.";
            document.getElementById('messageSendStatus').style.color = "#2E92B0";
        }
        else 
        {
            document.getElementById('messageSendStatus').innerHTML = "메시지를 보낼 수 없습니다. 관리자에게 문의 바랍니다.";
            document.getElementById('messageSendStatus').style.color = "#EB5757";
        }
        console.log("Send password on email status: " + status_code);
    });
}

// send email on given email id
function sendMail() {
    var input_email = $("#manager_selectlist :selected").val();
    var message = $("#msgArea").val();
    if(!$('#select_siteManager').val())
    {
        document.getElementById('messageSendStatus').innerHTML = "메시지를 보낼 관리자를 선택하세요.";
        document.getElementById('messageSendStatus').style.color = "#EB5757";
    }
    else
    {
        if(message.length > 0)
        {
            var postdata = JSON.stringify({
                "email": input_email,
                "message" : message
            });
            sendEmailAPI(postdata);
        }
        else
        {
            document.getElementById('messageSendStatus').innerHTML = "메시지를 입력하세요.";
            document.getElementById('messageSendStatus').style.color = "#EB5757";
        }
    }
}

function postMethod(data, api_url, callback) {
    const requestURL = api_url;
    var username = localStorage.getItem("userId"); //"admin@aspringcloud.com";
    var password = localStorage.getItem("userPwd"); //"spring#007";
    var base64Credentials = "Basic " + btoa(username + ":" + password);
    var request = new XMLHttpRequest();
    request.open('POST', requestURL, true);
    request.onload = function (e) {
        if(api_url == server_URL +"auth/password/change/" || api_url == server_URL+"auth/login/" || api_url == server_URL+"oplogs/by-date/" )
            callback(request);
        else
            callback(request.status);
     };
    request.onerror = function(status) {
        console.log("Error (POST).");
    };
    if(api_url == server_URL+"auth/login/")
    {
        request.setRequestHeader("Authorization", authenticateUser((JSON.parse(data)).email, (JSON.parse(data)).password));
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8;");
    }
    else
    {
        request.setRequestHeader("Authorization", base64Credentials);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8;");
    }
    request.send(data);
}

function authenticateUser(username, password)
{
    // Base64 Encoding -> btoa
    var base64Credentials = "Basic " + btoa(username + ":" + password);
    return base64Credentials;
}

/* Registration page: browse image_file and crop it using cropper.js*/
let cropper = '';
function crop_image(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        document.getElementById('modal_div').style.display = 'block';
        reader.onload = function (e) {
            document.getElementById('crop_image').innerHTML = "";
            $("#imageModal").modal('show');
            var img = document.createElement("IMG");
            img.src = e.target.result;
            document.getElementById('modal_div').style.display = 'block';
            document.getElementById('crop_image').appendChild(img);
            cropper = new Cropper(img, {
                viewMode: 1,
                autoCropArea: 1,
                aspectRatio: 1,
                minContainerHeight: 400,
                minContainerWidth: 320,
                minCanvasWidth: 320,
                minCanvasHeight: 400,
            });
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Saves the croppped image to image-box in regestration page. 
function save_image() {
    document.getElementById('modal_div').style.display = 'block';
    let imgSrc = cropper.getCroppedCanvas({
    }).toDataURL();
    $('#imagePreview').css('background-image', 'url('+imgSrc+')');
    $('#imagePreview').hide();
    $('#imagePreview').fadeIn(650);
    cropper.destroy();
    $('#imageUpload').attr('name', $('input[type=file]').val());
}

// Clears the file input when close button
function clear_fileInput() {
    $('input[type=file]').val('');
}

function inputLengthCheck(input_value, error_p_dom, error_msg) {
    if (input_value.length == 0) {
        error_p_dom.innerHTML = error_msg;
        return false;
    }
    return true;
}

function inputMobileCheck(phone_no, error_p_dom, error_msg) {
    if (!phone_no.match(/^[0-9]{3}[-]+[0-9]{4}[-]+[0-9]{4}$/)) {
        error_p_dom.innerHTML = error_msg;
        return false;
    }
    return true;
}

function inputEmailCheck(email_id, error_p_dom, error_msg) {
    if(!email_id.includes('@'))
    {
        error_p_dom.innerHTML = '이메일 아이디를 올바르게 입력해 주세요.';
        return false;
    }
    else if(!email_id.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
        error_p_dom.innerHTML = error_msg;
        return false;
    }
    return true;
}

function show_userList(response_data) {
    var json_data = JSON.parse(response_data);
    var tableRef = document.getElementById('userListTable').getElementsByTagName('tbody')[0];
    for (var i = 0; i < json_data.results.length; i++) {
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.value = "value";
        checkbox.id = json_data.results[i].pk;

        // Insert a row in the table at the last row
        var newRow = tableRef.insertRow();
        var newCell = newRow.insertCell(0);
        newCell.appendChild(checkbox);
        newCell.style.minWidth = "100px";
        newCell.style.maxWidth = "120px";

        createCell(newRow, 1, i + 1, 100, 120); // second cell
        createCell(newRow, 2, json_data.results[i].email, 200, 210); // Third cell E-mail
        createCell(newRow, 3, json_data.results[i].username, 100, 120); // Fourth cell Name

        if (json_data.results[i].profile != null) {
            createCell(newRow, 4, json_data.results[i].profile.team, 100, 120); // Fifth cell Team
            var newCell = newRow.insertCell(5); // Sixth cell photo
            var newImg = document.createElement('img');
            newImg.src = json_data.results[i].profile.photo;
            newImg.classList.add("table_img");
            newCell.appendChild(newImg);
            newCell.style.width = "100px";
            createCell(newRow, 6, json_data.results[i].profile.level, 100, 120); // Seventh cell level
        } else {
            createCell(newRow, 4, "N/A", 100, 120); // Fifth cell Team
            createCell(newRow, 5, "N/A", 100, 120); // Sixth cell photo
            createCell(newRow, 6, "N/A", 100, 120); // Seventh cell level
        }
    }
}

function createCell(newRow, cell_number, nodeText, minWidth, maxWidth) {
    var newCell = newRow.insertCell(cell_number);
    var newText = document.createTextNode(nodeText);
    newCell.appendChild(newText);
    newCell.style.minWidth = minWidth + "px";
    newCell.style.maxWidth = maxWidth + "px";
}

function updateUserData() {
    var notChecked = [],
        checked = [];
    $(":checkbox").each(function () {
        if (this.checked) {
            checked.push(this.id);
        } else {
            notChecked.push(this.id);
        }
    });
    document.getElementById('imageUpload').src = "";
    document.getElementById('select_level').value = "";
    document.getElementById('signup_id').value = "";
    document.getElementById('sel_team').value = "";
    document.getElementById('signup_phone').value = "";
    document.getElementById('signup_name').value = "";
    document.getElementById('signup_affiliation').value = "";
    document.getElementById('registration_div').style.display = "block";
    document.getElementById('userlist_table_div').style.display = "none";
}

/* When checkbox is checked, store user_id in local storage - user_id can be reset by clearing browser cache */
function saveID_localstorage() 
{
    if ($('#saveId_checkbox').is(':checked')) 
    {
        localStorage.setItem('localStorage_inputId', document.getElementById("input_id").value);
        localStorage.setItem('localStorage_checked', 'true');
        return false;
    }
    else{
        localStorage.setItem('localStorage_inputId', '');
        localStorage.setItem('localStorage_checked', 'false');
    }
}

/* Assign the user_id fromm the local storage when login page is loaded */
window.onload = function () {
    var input_id = document.getElementById("input_id");
    if (input_id != null) {
        input_id.value = localStorage.getItem("localStorage_inputId");
        checkboxStatus = localStorage.getItem("localStorage_checked");
        if(checkboxStatus == 'true')
           document.getElementById("saveId_checkbox").checked = true;
        else
           document.getElementById("saveId_checkbox").checked = false;
     }
}
