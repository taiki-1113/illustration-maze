import {CX,CY,OUTER} from './maze.js';
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
