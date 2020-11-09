timepoint_class_names = ['앵커 멘트', '기자 멘트', '인터뷰', '자료 화면'];

function custom_select () {
    var x, i, j, l, ll, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /* For each option in the original select element,
        create a new DIV that will act as an option item: */
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function(e) {
            /* When an item is clicked, update the original select box,
            and the selected item: */
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
                s.selectedIndex = i;
                h.innerHTML = this.innerHTML;

                /*------ item click -------*/
                // console.log(this.innerHTML); 
                set_option(i);

                y = this.parentNode.getElementsByClassName("same-as-selected");
                yl = y.length;
                for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
                }
                this.setAttribute("class", "same-as-selected");
                break;
            }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function(e) {
        /* When the select box is clicked, close any other select boxes,
        and open/close the current select box: */
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
    }
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
  }

/*------- data loader -------*/
var video_ids = ['VAScKwUvn4s', 'h2oT2T9NiZw'];
var video_dates = ['2019년 7월 1일', '2019년 7월 1일'];
var cut_points = [];
var point_classes = [];

function readTextFile(file)
{
    // https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
    console.log(rawFile);
}

function load_data(path) {
    // readTextFile(path);
    // var file = new File(path);
    // var reader = new FileReader();
    // reader.onload =function() {
    //     output.innerText = reader.result;
    // };
    // reader.readAsText(file);
//     var fs = require('fs');

//     fs.readFile(path, function (err, data) {
//                     if (err) throw err;

//     console.log(data);
// });


    reader = new ActiveXObject("Scripting.FileSystemObject");
    var file = reader.OpenTextFile(path, 1);
    output = file.ReadAll();
    console.log(output)
}

/*-------------------------------------------*/
var reader = new XMLHttpRequest() || new ActiveXObject('MSXML2.XMLHTTP');

function loadFile(path) {
    reader.open('get', path, true); 
    reader.onreadystatechange = displayContents;
    reader.send(null);
}

function displayContents() {
    if(reader.readyState==4) {
        console.log(reader.responseText);
    }
}
/*-------------------------------------------*/



/*------- set option with data -------*/
function set_option(idx) {
    // set video timeline options
    var video_elems = document.getElementsByClassName('timeline_element');
    for (var elem of video_elems) {
        var timeline = elem.querySelector('.video_timeline');
        var _cut_points = timeline.getAttribute('points');
        var _point_classes = timeline.getAttribute('point_class');

        var cut_point_split = _cut_points.split(',');
        var point_classes_split = _point_classes.split(',');

        timeline.innerHTML = "";        
        
        for (var i = 0; i < cut_point_split.length; i++) {
            var cls_idx = point_classes_split[i];
            if (cls_idx.length == 0) {
                continue;
            }
            if (cls_idx == idx-1) {
                var time = cut_point_split[i];
                var time_minute = parseInt(time.substring(0,2));
                var time_second = parseInt(time.substring(3,5));
                create_cut_point_ui(elem, idx-1, time_minute*60+time_second);
            }
        }
    }
}
 
/*------- create video UI -------*/

function create_video_ui(id, date, cut_points, point_classes, video_length) {
    var wrapper = document.getElementById('right_wrapper');
    
    var element = document.createElement('div');
    element.classList.toggle('timeline_element');

    var timeline_dot = document.createElement('div');
    timeline_dot.classList.toggle('timeline_dot');

    var video_date = document.createElement('div');
    video_date.classList.toggle('video_date');
    video_date.innerHTML = date

    var ytplayer = document.createElement('iframe');
    ytplayer.classList.toggle('ytplayer');
    var src = "https://www.youtube.com/embed/" + id + "?autoplay=1&controls=0"
    ytplayer.setAttribute('src', src);
    ytplayer.setAttribute('frameborder','0');

    var video_timeline = document.createElement('div');
    video_timeline.classList.toggle('video_timeline');
    video_timeline.setAttribute('points', cut_points);
    video_timeline.setAttribute('point_class', point_classes);
    video_timeline.setAttribute('video_length', video_length);
    video_timeline.setAttribute('video_id', id);


    wrapper.appendChild(element);
    element.appendChild(timeline_dot);
    element.appendChild(video_date);
    element.appendChild(ytplayer);
    element.appendChild(video_timeline);
}

function create_cut_point_ui(elem, cls_idx, time) {
    var timeline = elem.querySelector('.video_timeline');
    var video_length = timeline.getAttribute('video_length');
    var time_point = document.createElement('div');
    var time_des = document.createElement('div');

    time_des.innerHTML = timepoint_class_names[cls_idx];

    time_point.classList.toggle('time_point');
    time_des.classList.toggle('time_des');

    time_point.style.left = time / video_length * 100 + "%";

    time_point.appendChild(time_des);
    timeline.appendChild(time_point);

    time_point.addEventListener('click', ()=> {
        var ytplayer = elem.querySelector('.ytplayer');
        var id = timeline.getAttribute('video_id');
        var src = "https://www.youtube.com/embed/" + id + "?autoplay=1&controls=0&start=" + time;
        ytplayer.setAttribute('src', src);
    });
}

// create_video_ui('VAScKwUvn4s', '2019년 7월 1일', '00:00,00:20,00:43,00:58,01:08,01:28,01:42', '0,1,3,2,1,2,1', 115);
// create_video_ui('h2oT2T9NiZw', '2019년 7월 1일', '00:00,00:18,00:49,00:56,01:00,01:24,01:30', '0,1,2,1,3,2,1', 112);

/*------- search -------*/
function init() {
    search_form = document.getElementById('form_keyword');
    search_form.addEventListener('keyup', (e)=> {
        if (e.keyCode === 13) submit(search_form.value);
    });

    loadFile('data/data.json');
}

function submit(text) {
    console.log(text);
}






// ---------- main --------- //
custom_select();
/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);

init();