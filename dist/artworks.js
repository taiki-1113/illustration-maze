import {CX,CY,OUTER} from './maze.js';
import {GARDEN_FLOWERS,GARDEN_WINGS} from './fish-maze.js';
export function drawSnail(svg,make,draw){
svg.innerHTML=`<defs><linearGradient id="body" x2="0.5" y2="1"><stop stop-color="#fff0b3"/><stop offset="1" stop-color="#f4dc87"/></linearGradient><linearGradient id="leaf" x2="1" y2="1"><stop stop-color="#bbce9b"/><stop offset="1" stop-color="#92b681"/></linearGradient></defs>`;
// A quiet botanical setting keeps the playable shell easy to read.
make('ellipse',{cx:389,cy:566,rx:269,ry:18,fill:'#edf0dd'});
draw('M 99 552 Q 75 529 80 513 Q 102 519 105 544 Q 100 519 118 505 Q 129 531 110 550', '#b6ca98','none');
draw('M 655 552 Q 639 533 644 519 Q 662 525 662 543 Q 670 517 684 516 Q 688 537 667 553', '#b6ca98','none');
draw('M 126 551 C 190 568 399 582 562 557 C 637 546 678 501 691 465 C 697 445 685 432 670 440 L 600 475 L 248 425 C 215 425 205 404 208 370 C 228 335 228 292 209 270 L 220 211 C 232 208 235 195 232 184 C 226 166 201 168 197 184 C 193 193 198 205 206 209 L 192 257 Q 171 248 146 252 L 140 209 C 151 202 154 186 145 178 C 134 167 115 172 112 185 C 109 197 116 207 126 211 L 126 261 C 94 281 85 309 93 337 C 99 362 122 376 136 390 C 145 413 139 438 131 471 C 119 505 111 534 126 551 Z','url(#body)');
make('circle',{cx:135,cy:187,r:7,fill:'#51432f'});make('circle',{cx:215,cy:189,r:7,fill:'#51432f'});
make('ellipse',{cx:120,cy:328,rx:15,ry:9,fill:'#e9a693',opacity:.65});make('ellipse',{cx:199,cy:328,rx:15,ry:9,fill:'#e9a693',opacity:.65});
make('ellipse',{cx:140,cy:310,rx:5.5,ry:7,fill:'#493c2b'});make('ellipse',{cx:181,cy:310,rx:5.5,ry:7,fill:'#493c2b'});draw('M 150 330 Q 160 343 172 329','none','#493c2b',4);
make('circle',{cx:CX,cy:CY,r:OUTER,fill:'#fffdf5',stroke:'none'});
draw(`M ${CX-12} ${CY+19} C ${CX-51} ${CY-1} ${CX-20} ${CY-43} ${CX+12} ${CY-24} C ${CX+40} ${CY-6} ${CX+16} ${CY+31} ${CX-3} ${CY+16} Q ${CX-13} ${CY+6} ${CX} ${CY}`, 'none','#d4b77c',4);

}
export function drawTurtle(svg,make,draw){
 svg.innerHTML='<defs><linearGradient id="turtle-skin" x2=".4" y2="1"><stop stop-color="#d3e4b4"/><stop offset="1" stop-color="#b1cb95"/></linearGradient></defs>';
 make('ellipse',{cx:380,cy:572,rx:242,ry:18,fill:'#edf0dd'});
 // Head, four feet and tail sit behind the shell; the face stays fully visible.
 draw('M 346 523 Q 357 562 380 574 Q 404 563 415 523','url(#turtle-skin)','#536d4c',5);
 draw('M 223 181 C 181 145 136 154 127 184 C 120 211 143 238 183 247 L 228 217 Z','url(#turtle-skin)','#536d4c',5);
 draw('M 537 181 C 579 145 624 154 633 184 C 640 211 617 238 577 247 L 532 217 Z','url(#turtle-skin)','#536d4c',5);
 draw('M 216 450 C 175 445 139 474 142 506 C 146 536 182 545 220 513 L 248 475 Z','url(#turtle-skin)','#536d4c',5);
 draw('M 544 450 C 585 445 621 474 618 506 C 614 536 578 545 540 513 L 512 475 Z','url(#turtle-skin)','#536d4c',5);
 draw('M 342 156 L 329 104 C 318 60 344 28 380 28 C 416 28 442 60 431 104 L 418 156 Z','url(#turtle-skin)','#536d4c',5);
 make('ellipse',{cx:347,cy:91,rx:12,ry:7,fill:'#e7b3a0',opacity:.8});make('ellipse',{cx:413,cy:91,rx:12,ry:7,fill:'#e7b3a0',opacity:.8});
 make('ellipse',{cx:359,cy:76,rx:5,ry:7,fill:'#493c2b'});make('ellipse',{cx:401,cy:76,rx:5,ry:7,fill:'#493c2b'});
 draw('M 369 94 Q 380 107 392 94','none','#493c2b',4);
 for(const [x,y,sign] of [[149,194,1],[611,194,-1],[165,508,1],[595,508,-1]]){
  draw(`M ${x} ${y} l ${sign*9} -5 M ${x+sign*5} ${y+12} l ${sign*10} -5`,'none','#7e9a68',3);
 }
 draw('M 93 525 Q 76 501 84 488 Q 102 496 101 516 Q 105 493 121 493 Q 121 514 105 528','#b6ca98','none');
 draw('M 652 556 Q 637 537 645 524 Q 661 530 661 547 Q 665 530 678 531 Q 678 550 666 558','#b6ca98','none');
}
export function drawFish(svg,make,draw){
 svg.innerHTML='<defs><linearGradient id="fish-blue" x2=".2" y2="1"><stop stop-color="#d4eced"/><stop offset="1" stop-color="#a9d2d8"/></linearGradient></defs>';
 make('ellipse',{cx:386,cy:548,rx:276,ry:13,fill:'#eaf1ec'});
 draw('M 255 181 Q 290 105 346 103 Q 367 125 386 175 Z','url(#fish-blue)','#719ca4',4);
 draw('M 286 468 Q 318 527 370 513 L 396 464 Z','url(#fish-blue)','#719ca4',4);
 draw('M 534 304 L 692 205 Q 678 317 692 436 L 534 336 Z','url(#fish-blue)','#719ca4',4);
 make('ellipse',{cx:335,cy:320,rx:230,ry:165,fill:'#c2dfe1'});
 draw('M 144 268 C 111 249 72 264 67 299 C 61 336 93 361 128 354 L 155 331 Z','url(#fish-blue)','#719ca4',4);
 make('ellipse',{cx:91,cy:292,rx:5,ry:7,fill:'#493c2b'});
 make('ellipse',{cx:83,cy:312,rx:10,ry:6,fill:'#e8b7a8',opacity:.8});
 draw('M 78 327 Q 89 337 101 326','none','#493c2b',3);
 for(const [x,y,r] of [[51,246,8],[65,218,5],[39,198,10]])make('circle',{cx:x,cy:y,r,fill:'none',stroke:'#c0dce0','stroke-width':3});
 draw('M 100 530 Q 86 510 90 494 Q 111 506 108 527 Q 114 510 128 511 Q 128 528 113 535','#b8ceac','none');
 draw('M 647 532 Q 645 501 660 493 Q 670 517 656 536 M 662 535 Q 669 517 682 518 Q 683 533 669 540','#b8ceac','none');
}
export function drawOwl(svg,make,draw){
 svg.innerHTML='<defs><linearGradient id="owl-body" x2=".3" y2="1"><stop stop-color="#e9d7ba"/><stop offset="1" stop-color="#cbb28e"/></linearGradient></defs>';
 make('ellipse',{cx:380,cy:580,rx:226,ry:13,fill:'#efeddf'});
 draw('M 291 535 L 283 566 M 305 537 L 305 569 M 319 535 L 327 566 M 441 535 L 433 566 M 455 537 L 455 569 M 469 535 L 477 566','none','#b59662',8);
 draw('M 235 282 L 137 437 Q 162 476 245 491 L 289 375 Z','url(#owl-body)','#978068',4);
 draw('M 525 282 L 623 437 Q 598 476 515 491 L 471 375 Z','url(#owl-body)','#978068',4);
 make('ellipse',{cx:380,cy:370,rx:211,ry:184,fill:'#d8c6aa'});
 draw('M 253 157 Q 232 109 248 69 L 300 92 Q 380 62 460 92 L 512 69 Q 528 109 507 157 Q 509 222 452 237 L 308 237 Q 251 222 253 157 Z','url(#owl-body)','#978068',4);
 for(const x of [326,434]){
  make('ellipse',{cx:x,cy:145,rx:49,ry:54,fill:'#fff7e6'});
  make('circle',{cx:x,cy:143,r:23,fill:'#4e4439'});
  make('circle',{cx:x-7,cy:135,r:7,fill:'#fffdf5'});
 }
 draw('M 368 169 L 380 187 L 392 169 Z','#d8ad68','#aa864d',2.5);
 make('ellipse',{cx:277,cy:175,rx:14,ry:7,fill:'#dda993',opacity:.65});make('ellipse',{cx:483,cy:175,rx:14,ry:7,fill:'#dda993',opacity:.65});
 draw('M 116 516 Q 99 491 105 478 Q 125 489 122 510 Q 128 493 142 493 Q 142 515 126 522','#b9c7a1','none');
 draw('M 632 548 Q 632 523 647 515 Q 655 537 641 551','#b9c7a1','none');
 for(const [x,y] of [[160,148],[581,179],[610,118]])draw(`M ${x} ${y-7} L ${x+2} ${y-2} L ${x+7} ${y} L ${x+2} ${y+2} L ${x} ${y+7} L ${x-2} ${y+2} L ${x-7} ${y} L ${x-2} ${y-2} Z`,'#d8c79b','none');
}
export function drawRocket(svg,make,draw){
 svg.innerHTML='<defs><linearGradient id="rocket-cap" x2=".3" y2="1"><stop stop-color="#eeb9ac"/><stop offset="1" stop-color="#dc9c91"/></linearGradient></defs>';
 make('ellipse',{cx:380,cy:612,rx:193,ry:11,fill:'#f1ebdf'});
 draw('M 317 485 Q 290 553 327 587 L 349 563 L 381 609 L 411 565 L 433 587 Q 471 548 443 485 Z','#f0c784','#d0a369',3);
 draw('M 345 489 Q 334 538 380 572 Q 426 538 415 489 Z','#fff0b3','none');
 draw('M 239 324 L 123 519 Q 191 531 251 479 Z','url(#rocket-cap)','#aa8078',4);
 draw('M 521 324 L 637 519 Q 569 531 509 479 Z','url(#rocket-cap)','#aa8078',4);
 draw('M 214 211 Q 246 121 380 51 Q 514 121 546 211 L 546 489 L 214 489 Z','#d5e5e6','#8aa6ac',4);
 draw('M 214 211 Q 246 121 380 51 Q 514 121 546 211 L 499 199 Q 438 169 380 155 Q 322 169 261 199 Z','url(#rocket-cap)','#aa8078',4);
 make('circle',{cx:380,cy:119,r:29,fill:'#f9f5e9',stroke:'#ae8580','stroke-width':4});
 make('circle',{cx:380,cy:119,r:20,fill:'#c1dfe4',stroke:'#8caab2','stroke-width':2});
 draw('M 369 111 Q 372 105 378 104','none','#f8ffff',4);
 for(const [x,y,r] of [[138,143,8],[600,100,11],[650,285,6],[95,294,5]])draw(`M ${x} ${y-r} L ${x+3} ${y-3} L ${x+r} ${y} L ${x+3} ${y+3} L ${x} ${y+r} L ${x-3} ${y+3} L ${x-r} ${y} L ${x-3} ${y-3} Z`,'#ddc892','none');
 make('circle',{cx:149,cy:238,r:4,fill:'#d0dfe0'});make('circle',{cx:613,cy:173,r:5,fill:'#d0dfe0'});
}
export function drawFamily(svg,make,draw){
 svg.innerHTML='<defs><linearGradient id="hen-cream" x2=".3" y2="1"><stop stop-color="#fff7df"/><stop offset="1" stop-color="#e9d9b1"/></linearGradient><linearGradient id="chick-yellow" x2=".3" y2="1"><stop stop-color="#fff0a7"/><stop offset="1" stop-color="#e9cd77"/></linearGradient></defs>';
 make('ellipse',{cx:644,cy:721,rx:493,ry:20,fill:'#edf0df'});
 draw('M 330 610 L 330 670 M 465 610 L 465 670 M 313 678 L 330 670 L 347 678 M 448 678 L 465 670 L 482 678','none','#c4a166',7);
 draw('M 978 652 L 978 690 M 1022 652 L 1022 690 M 967 697 L 978 690 L 990 697 M 1011 697 L 1022 690 L 1034 697','none','#c4a166',6);
 // The grass is part of the same connected maze, joining the three bodies.
 draw('M 432 612 Q 559 503 745 501 Q 865 520 1038 576 Q 1088 607 1095 663 Q 999 700 881 693 L 641 657 Z','#dce7c8','none');
 draw('M 578 432 Q 622 348 655 269 Q 676 212 699 238 Q 730 238 741 272 Q 752 333 705 476 L 614 546 Z','url(#hen-cream)','#b5a17d',4);
 make('ellipse',{cx:420,cy:440,rx:258,ry:187,fill:'url(#hen-cream)',stroke:'#b5a17d','stroke-width':4});
 draw('M 244 363 L 239 233 Q 235 198 255 178 L 370 178 Q 388 210 378 255 L 380 358 Z','url(#hen-cream)','#b5a17d',4);
 make('ellipse',{cx:307,cy:185,rx:81,ry:75,fill:'#fff8e4',stroke:'#b5a17d','stroke-width':4});
 draw('M 258 125 C 236 107 247 83 268 89 C 259 62 292 54 304 78 C 313 50 343 65 338 90 C 366 75 381 107 353 129 Z','#dfa195','#b88277',4);
 draw('M 376 187 L 412 205 L 375 218 Z','#e3b868','#b99861',3);
 draw('M 379 220 C 402 236 393 257 378 251 Q 365 241 379 220 Z','#dfa195','#b88277',3);
 make('ellipse',{cx:338,cy:176,rx:7,ry:9,fill:'#514638'});make('circle',{cx:336,cy:173,r:2,fill:'#fff'});
 make('ellipse',{cx:348,cy:200,rx:14,ry:7,fill:'#e5b4a0',opacity:.65});
 draw('M 293 202 Q 306 215 320 203','none','#b5a17d',3);
 make('ellipse',{cx:815,cy:490,rx:113,ry:102,fill:'url(#chick-yellow)',stroke:'#bda76b','stroke-width':4});
 make('circle',{cx:812,cy:350,r:63,fill:'url(#chick-yellow)',stroke:'#bda76b','stroke-width':4});
 draw('M 791 290 Q 788 273 803 277 M 809 288 Q 814 270 825 279','none','#bda76b',4);
 make('ellipse',{cx:832,cy:341,rx:5.5,ry:7,fill:'#514638'});make('circle',{cx:830,cy:339,r:1.8,fill:'#fff'});
 draw('M 869 348 L 893 362 L 868 374 Z','#e3b868','#b99861',3);
 make('ellipse',{cx:844,cy:365,rx:12,ry:6,fill:'#e5b4a0',opacity:.7});
 make('ellipse',{cx:1005,cy:592,rx:96,ry:86,fill:'url(#chick-yellow)',stroke:'#bda76b','stroke-width':4});
 make('circle',{cx:1005,cy:465,r:55,fill:'url(#chick-yellow)',stroke:'#bda76b','stroke-width':4});
 draw('M 987 413 Q 986 398 998 402 M 1004 412 Q 1010 395 1020 405','none','#bda76b',3);
 make('ellipse',{cx:1021,cy:458,rx:5,ry:6.5,fill:'#514638'});make('circle',{cx:1019,cy:456,r:1.5,fill:'#fff'});
 draw('M 1056 463 L 1078 476 L 1054 486 Z','#e3b868','#b99861',3);
 make('ellipse',{cx:1032,cy:479,rx:10,ry:5.5,fill:'#e5b4a0',opacity:.7});
 for(const [x,y] of [[136,641],[711,706],[1124,687]])draw(`M ${x} ${y} Q ${x-22} ${y-26} ${x-13} ${y-39} Q ${x+4} ${y-29} ${x+2} ${y-9} Q ${x+10} ${y-33} ${x+25} ${y-31} Q ${x+27} ${y-9} ${x+9} ${y+1} Z`,'#afc493','none');
 for(const [x,y] of [[139,193],[1061,264]]){make('circle',{cx:x,cy:y,r:5,fill:'#e0c78c'});draw(`M ${x-9} ${y-6} Q ${x-24} ${y-20} ${x-26} ${y-3} M ${x+9} ${y-6} Q ${x+24} ${y-20} ${x+26} ${y-3}`,'none','#c4cda9',3);}
}
export function drawGarden(svg,make,draw){
 svg.innerHTML='<defs><linearGradient id="garden-leaf" x2=".3" y2="1"><stop stop-color="#e2eccd"/><stop offset="1" stop-color="#c2d8be"/></linearGradient></defs>';
 make('ellipse',{cx:645,cy:711,rx:493,ry:17,fill:'#edf1e3'});
 draw('M 300 430 L 340 430 L 340 665 L 300 665 Z','url(#garden-leaf)','#a4b38e',4);
 draw('M 955 500 L 995 500 L 995 665 L 955 665 Z','url(#garden-leaf)','#a4b38e',4);
 draw('M 302 553 Q 405 440 592 447 L 650 515 Q 527 614 365 608 Z','url(#garden-leaf)','#a4b38e',4);
 draw('M 680 500 Q 825 468 988 563 L 966 660 Q 831 628 710 575 Z','url(#garden-leaf)','#a4b38e',4);
 for(const flower of GARDEN_FLOWERS){
  for(const [cx,cy,rx,ry] of flower.petals)make('ellipse',{cx,cy,rx:rx+6,ry:ry+6,fill:flower.region==='pink'?'#efd3d4':'#f2dfa1',stroke:flower.region==='pink'?'#bd999d':'#bfa96b','stroke-width':4});
  make('circle',{cx:flower.cx,cy:flower.cy,r:33,fill:'#fff0bd',stroke:'#c9b17a','stroke-width':3});
  for(const [dx,dy] of [[0,0],[-11,-7],[10,-8],[-12,8],[11,9],[0,15],[0,-17]])make('circle',{cx:flower.cx+dx,cy:flower.cy+dy,r:2.5,fill:'#c8a969'});
 }
 for(const [cx,cy,rx,ry] of GARDEN_WINGS)make('ellipse',{cx,cy,rx:rx+7,ry:ry+7,fill:'#e1d3ec',stroke:'#a894b5','stroke-width':4});
 draw('M 662 200 Q 670 191 678 200 L 678 247 L 662 247 Z','#b5a27f','none');
 make('ellipse',{cx:670,cy:188,rx:12,ry:16,fill:'#b5a27f'});
 draw('M 664 176 Q 654 151 642 155 M 676 176 Q 686 151 698 155','none','#a59579',3);
 for(const [x,y] of [[178,628],[1067,664]])draw(`M ${x} ${y} Q ${x-24} ${y-21} ${x-17} ${y-39} Q ${x+3} ${y-32} ${x+3} ${y-9} Q ${x+14} ${y-34} ${x+29} ${y-29} Q ${x+28} ${y-6} ${x+9} ${y+2} Z`,'#b4c99d','none');
 for(const [x,y] of [[125,211],[1094,283],[480,122]]){
  make('circle',{cx:x,cy:y,r:5,fill:'#e2ca91'});
  draw(`M ${x-11} ${y-5} Q ${x-25} ${y-20} ${x-29} ${y-5} M ${x+11} ${y-5} Q ${x+25} ${y-20} ${x+29} ${y-5}`,'none','#c5d1b5',3);
 }
}
export function drawSea(svg,make,draw){
 svg.innerHTML='<defs><linearGradient id="sea-water" x2=".1" y2="1"><stop stop-color="#e5f1f4"/><stop offset="1" stop-color="#d3e9ed"/></linearGradient></defs>';
 make('ellipse',{cx:615,cy:718,rx:500,ry:17,fill:'#f1eddf'});
 make('ellipse',{cx:610,cy:400,rx:513,ry:283,fill:'url(#sea-water)'});
 // Animals occupy reserved holes in the maze; paths run through the water.
 draw('M 477 354 C 513 348 514 309 538 300 Q 561 299 554 335 Q 580 308 599 316 Q 608 337 575 360 L 491 382 Z','#9bc8d1','#6c98a4',3.5);
 make('ellipse',{cx:340,cy:345,rx:158,ry:85,fill:'#a4ced8',stroke:'#6c98a4','stroke-width':3.5});
 draw('M 196 366 Q 320 422 480 365 Q 450 414 340 422 Q 223 416 196 366 Z','#e3f0f2','none');
 draw('M 360 365 Q 363 405 398 414 Q 422 405 422 373 Z','#96bfcb','#6c98a4',3);
 make('circle',{cx:245,cy:322,r:5,fill:'#456574'});make('circle',{cx:243.5,cy:320.5,r:1.5,fill:'#f9ffff'});
 draw('M 207 348 Q 222 360 238 349','none','#6c98a4',3);
 // Fish: an uninterrupted body, a small eye, and a separate tail.
 draw('M 927 253 L 993 226 Q 982 266 993 307 L 927 281 Z','#edc0a2','#bc9a80',3.5);
 make('ellipse',{cx:848,cy:267,rx:85,ry:49,fill:'#efd0b4',stroke:'#bc9a80','stroke-width':3.5});
 draw('M 855 279 Q 869 302 893 286 L 881 275 Z','#e2b797','#bc9a80',2.5);
 draw('M 823 247 Q 812 266 824 285','none','#c7a68b',2.5);make('circle',{cx:794,cy:256,r:4,fill:'#665b51'});
 // Turtle: a low, rounded shell and short flippers.
 draw('M 811 504 Q 791 489 804 479 Q 823 478 839 498 M 920 501 Q 946 478 954 492 Q 953 506 935 517 M 823 571 Q 804 585 823 595 Q 838 594 848 579 M 920 570 Q 940 586 950 575 Q 948 561 934 555','none','#adc7a4',15);
 draw('M 795 543 L 771 551 L 797 557 Z','#b6cfac','#859f7e',2.5);
 make('ellipse',{cx:980,cy:520,rx:30,ry:24,fill:'#c9dab9',stroke:'#859f7e','stroke-width':3});
 make('ellipse',{cx:870,cy:535,rx:83,ry:56,fill:'#bad0b1',stroke:'#859f7e','stroke-width':3.5});
 draw('M 851 505 L 888 505 L 910 535 L 888 565 L 851 565 L 830 535 Z M 851 505 L 834 488 M 888 505 L 904 490 M 910 535 L 950 535 M 888 565 L 904 581 M 851 565 L 834 581 M 830 535 L 789 535','none','#96b08d',2.5);
 make('circle',{cx:991,cy:512,r:3,fill:'#50654d'});draw('M 988 526 Q 995 531 1001 526','none','#859f7e',2);
 // Quiet seabed details stay outside the playable water.
 for(const [x,y] of [[214,669],[1084,658]]){
  draw(`M ${x} ${y} L ${x} ${y-40} M ${x} ${y-15} Q ${x-23} ${y-18} ${x-22} ${y-37} M ${x} ${y-27} Q ${x+20} ${y-30} ${x+20} ${y-48}`,'none','#d5b6a2',8);
 }
 draw('M 286 689 Q 269 667 275 649 Q 296 657 294 678 Q 303 650 316 650 Q 317 674 303 692 M 1026 683 Q 1005 661 1016 641 Q 1036 654 1033 675','#b6cdbd','none');
 for(const [x,y,r] of [[212,209,9],[190,184,5],[1026,159,7]])make('circle',{cx:x,cy:y,r,fill:'none',stroke:'#c0d9df','stroke-width':3});
}
export function drawPicnic(svg,make){
 svg.innerHTML='';
 make('image',{href:'./assets/picnic-gouache.png',x:0,y:0,width:1200,height:800,preserveAspectRatio:'xMidYMid meet'},svg);
}
export function drawSpace(svg,make){
 svg.innerHTML='';
 make('image',{href:'./assets/space-adventure.png',x:0,y:0,width:1200,height:800,preserveAspectRatio:'xMidYMid meet'},svg);
}
