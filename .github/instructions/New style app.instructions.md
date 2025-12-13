---
applyTo: "*App-jeux-soiree*"
---

J'aimerais que tu metes à jour le style de l'application "Jeux de soirée" pour qu'elle corresponde au nouveau style des applications. Voici les instructions pour effectuer cette mise à jour :
Le html d'on tupeut t'inspirer est celui ci :

```pug
.container
 .card
   .header
     a.btn(href="#") &#9668; BACK
     .title
       .sub2 &#9742;
       .sub1 Call
       .sub3 String
     .i 	&#128266;
   .content
     h1 Players 7/8
     h1 Presets
     .block.player-list
       .player-amount 8 Players
       .player
         .img
           img(src="https://robohash.org/1?set=set1")
         .name Player 1
       .player
         .img
           img(src="https://robohash.org/2?set=set1")
         .name Player 2
       .player
         .img
           img(src="https://robohash.org/3?set=set1")
         .name Player 3
       .player
         .img
           img(src="https://robohash.org/4?set=set1")
         .name Player 4
       .player
         .img
           img(src="https://robohash.org/5?set=set1")
         .name Player 5
       .player
         .img
           img(src="https://robohash.org/6?set=set1")
         .name Player 6
       .player
         .img
           img(src="https://robohash.org/7?set=set1")
         .name Player 7
       .player
         .img
           img(src="https://robohash.org/8?set=set1")
         .name Player 8
     .block.preset-grid
       .preset
         .img
           img(src="https://robohash.org/1?set=set3")
         .desc Normal
       .preset
         .img
           img(src="https://robohash.org/2?set=set3")
         .desc No Rush
       .preset
         .img
           img(src="https://robohash.org/3?set=set3")
         .desc Secret
       .preset
         .img
           img(src="https://robohash.org/4?set=set3")
         .desc Speedrun
       .preset
         .img
           img(src="https://robohash.org/5?set=set3")
         .desc Knock Off
       .preset
         .img
           img(src="https://robohash.org/6?set=set3")
         .desc Sandwich


Le css d'on tupeut t'inspirer est celui ci  :
$size:0.75rem;
:root{
 font-family:sans-serif;
 font-size:1.2rem;
 color:#ccc;
}
*{
 box-sizing:border-box;
}
.container{
 display:grid;
 justify-content:center;
 align-items:center;
 padding:2rem;

 width:100%;
 height:100vh;
 background: linear-gradient(0deg, transparent 0%, rgba(132,123,255,0.7) 50%, transparent 100%),linear-gradient(0deg, rgba(120,56,209,0.8) 0%, rgba(132,123,255,0.5) 100%),linear-gradient(45deg, rgba(120,56,209,0.5) 0%, rgba(132,123,255,0.5) 100%),repeating-conic-gradient(rgba(132,123,255,0.5) 0% 2.5%, transparent 2.5% 5%),repeating-conic-gradient(from 45deg, #8d42f5 0% 25%, #7838d1 0% 50%) 50%/#{$size $size};
}

.card{
 padding:1rem;
 min-width:256px;
 min-height:256px;
 box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2),0px 4px 2px -2px rgba(255,255,255,0.2) inset,0px -4px 2px -2px rgba(255,255,255,0.2) inset;
 border-radius:1rem;
}

.card .header{
 display:flex;
 justify-content:space-between;
}

.btn{
 display:inline-block;
 color:#ccc;
 padding:1rem 1.5rem;
 background-color:rgba(120,56,209,1);
 border-radius:0.5rem;
 border:2px solid #ccc;
 text-decoration:none;
 font-weight:bold;
 vertical-align:middle;
}

.i{
 display:inline-block;
 color:white;
 font-size:1.5rem;
 text-align:center;
}
h1{
 $stroke-color:black;
 $stroke-width:2px;
 $stroke-blur:2px;
 color:white;
 text-shadow: $stroke-width  0 $stroke-blur $stroke-color,
   ($stroke-width * -1) 0 $stroke-blur $stroke-color,
   0 $stroke-width $stroke-blur $stroke-color,
   0 ($stroke-width * -1) $stroke-blur $stroke-color;

 text-transform:uppercase;
 font-weight:bold;
 color:rgba(55,255,200,1);
}

.content{
 display:grid;
 grid-template-columns: repeat(2, auto);
 justify-items: center;
 align-items: start;
 grid-gap: 1rem;
 margin:1rem;
}

.block{
 display:inline-block;
 padding:0.5rem;
 background-color:rgba(120,56,209,1);
 border-radius:1rem;
 width:100%;
 min-height:4rem;
 box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2),0px 4px 2px -2px rgba(255,255,255,0.2) inset,0px -4px 2px -2px rgba(255,255,255,0.2) inset;
}

.player-list{
 display:flex;
 flex-direction:column;
 justify-content:space-between;
}

.player-amount{
 background-color:rgba(120,0,255,1);
 border: 2px solid rgba(120,100,255,1);
 border-radius:0.5rem;
 padding:0.5rem;
 text-align:center;
 font-weight:bold;
 margin-bottom:0.5rem;
}

.player .img img{
 position:absolute;
 width:64px;
 height:64px;
 top:50%;
 left:50%;
 transform:translate(-50%,-50%);
}

.player{
 display:flex;
 align-items:center;
 background-color:#ccc;
 color:rgba(120,56,209,1);
 font-weight:bold;
 padding:0.5rem;
 border-radius:2rem 0.5rem 0.5rem 2rem;
 margin-bottom:0.5rem;
 vertical-align:middle;
 box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2),0px 4px 2px -2px rgba(255,255,255,0.2) inset,0px -4px 2px -2px rgba(255,255,255,0.2) inset;
}

.player>*{
 height:100%;
 flex-grow:1;
}

.player .name{
 display:inline-block;
 padding: 0 0.5rem;
}

.player .img{
 position:relative;
 border-radius:50%;
 width:56px;
 height:56px;
 border:2px solid black;
 overflow:hidden;
 background-color:rgba(50,225,50,1);
}

.player:nth-child(2n) .img{
 background-color:rgba(50,50,225,1);
}

.player:nth-child(3n) .img{
 background-color:rgba(225,50,50,1);
}

.preset-grid{
 display:grid;
 grid-template-columns: repeat(3, auto);
 grid-gap: 0.2rem;
}

.preset{
 display:flex;
 flex-direction:column;
 background-color:#ccc;
 border-radius:0.5rem;
 padding:0.5rem;
 justify-content:space-around;
 align-items: stretch;
 text-align:center;
 box-shadow:0px 0px 2px 2px rgba(0,0,0,0.2),0px 4px 2px -2px rgba(255,255,255,0.2) inset,0px -4px 2px -2px rgba(255,255,255,0.2) inset;
}

.preset img{
 width:64px;
 height:64px;
}

.preset .desc{
 text-align:center;
 color:rgba(120,56,209,1);
 font-weight:bold;
}
.title{
 position:relative;
 width:128px;
 font-size:2rem;
 text-align:center;


 $stroke-color:black;
 $stroke-width:2px;
 $stroke-blur:2px;
 color:white;
 text-shadow: $stroke-width  0 $stroke-blur $stroke-color,
   ($stroke-width * -1) 0 $stroke-blur $stroke-color,
   0 $stroke-width $stroke-blur $stroke-color,
   0 ($stroke-width * -1) $stroke-blur $stroke-color;

 text-transform:uppercase;
 font-size:1.5rem;
 font-weight:bold;
}
.title>*{
 position:relative;
}
.title>.sub1{
 font-size:1rem;
}
.title>.sub2{
 position:absolute;
 top:50%;
 left:50%;
 transform:translate(-50%,-50%);
 font-size:5rem;
 color:#000;
 text-shadow:0 0 0 #000;
}
```
