
let rows = 30, columns = 60, minesCount = 350;
let gameOver=true;
let firstClicked = false;

let tileImg = [];
let tileData = [];
let check=[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];

let unRevealedTile = "url(mine/none.jpg)";
let flagedTile = "url(mine/flag.png)";
let borderTile = "url(mine/boarder.png)";
let borderTileFlat = "url(mine/boarderflat.png)";

window.onload =function(){
    row.addEventListener("input",showRowAndCol);
    col.addEventListener("input",showRowAndCol);
    startGame();
}
// initiaization of gameOver
function startGame(){
    minesCount = Math.round(rows*columns/4.848);
    for(let i=0;i<11;i++){
        tileImg.push('url(mine/' + i + '.png)');
    }

    makeBorderRow("top");
    TimeAndReset();
    makeBorderRow("mid");
    // making middle Tiles
    for(let r=0;r<rows;r++){
        makeElement("p","boarder-side",borderTile,0,0);
        for(let c=0;c<columns;c++){
            makeElement("div",setId(r,c),unRevealedTile,0,1);
        }
        makeElement("p","boarder-side",borderTile,0,0);
    }

    makeBorderRow("down");
    document.getElementById("board").style.width = ""+(columns*20+20)+"px";
    document.getElementById("board").style.height = ""+(rows*20+60)+"px";
    document.getElementById("restart").style.padding = "15px "+(columns*10)+"px 15px "+(columns*10)+"px";
}

// creating boardr rows
function makeBorderRow(level){
    
    makeElement("p","corner","url(mine/corner" + level + "left.png",0,0);
    for(let r=0;r<columns;r++){
        makeElement("p","boarder-horizontal",borderTileFlat,0,0);
    }
    makeElement("p","corner","url(mine/corner" + level + "right.png",0,0);
}

function TimeAndReset(){
    
    makeElement("p","boarder-midside",borderTile,0,0);
    makeElement("p","restart","url(mine/happy.PNG",0,1);   
    restart.removeEventListener("mouseup",clickTile);
    restart.removeEventListener("mousedown",hope); 
    restart.addEventListener("mousedown",reset);
    makeElement("p","boarder-midside",borderTile,0,0);
    
}

// creating a element with eventLisner
function makeElement(type,id,image,degree,clickevent){
    let tile=document.createElement(type);
    tile.id = id;
    tile.style.backgroundImage = image;
    if(clickevent){
        tile.addEventListener("mouseup",clickTile);
        tile.addEventListener("mousedown",hope);
    }
    // diabling right click dialog box
    tile.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
    if(degree!=0){
        tile.style.transform = 'rotate(' + degree + 'deg)';
    }
    document.getElementById("board").append(tile);
}

// takes location and returns id
function setId(r,c){
    let idR= r.toString() + "-",idC= c.toString();
    return r<10 ? c<10? "0" + idR + "0" + idC : "0" + idR + idC : c<10? idR + "0" + idC : idR + idC;
}




// populating bombs
function createBomb(a,b){

    tileData = [];
    for(let r=0;r<rows;r++){
        let R=[];
        for(let c=0;c<columns;c++){
            R.push([0,0,0]);
        }
        tileData.push(R);
    }

    let count=0;
    while(count!=minesCount){
        let x=Math.floor(Math.random() * rows);
        let y=Math.floor(Math.random() * columns);
        if( tileData[x][y][0]==0 && !firstClick(a,b,x,y) && (a!=x || b!=y)){
            tileData[x][y][0]=9;
            count+=1;
        }
    }

    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            tileData[r][c][0]=countBomb(r,c);
        }
    }
    console.log(tileData);
}

// not puting bomb on first click nebors
function firstClick(r,c,x,y){
    
    for(let i=0;i<check.length;i++){
        let a=r+check[i][0],b=c+check[i][1];
        if(a > -1 && b > -1 && a < rows && b < columns && (a==x && b==y)){
            return true;
        }
    }
    return false;
}

// filling data in tileData acc. to bombs
function countBomb(r,c){
    
    if(tileData[r][c][0]==9){
        return 9;
    }
    let count=0;
    for(let i=0;i<check.length;i++){
        let x=r+check[i][0],y=c+check[i][1];
        if(x > -1 && y >-1 && x <rows && y < columns && tileData[x][y][0]==9){
            count+=1;
        }
    }
    return count;
}




// runs after clicked on tile
function clickTile(event){
    let tile = this;
    restart.style.backgroundImage="url(mine/happy.PNG";
    let x=+tile.id.substr(0,2),y=+tile.id.substr(3,2);

    if(!firstClicked){
        createBomb(x,y);
        console.log("countBomb");
        firstClicked = true;
        gameOver = false;
    }
    
    if(event.button==0){
        onleftclick(tile,x,y);
    }
    else if(event.button==2){
        onRightclick(tile,x,y);
    }
}

// update reset icon
function hope(){
    restart.style.backgroundImage="url(mine/click.PNG";
}

// removing flag on left click
function onleftclick(tile,x,y){

    if(tileData[x][y][2] == 1){
        tile.style.backgroundImage = unRevealedTile;
        tileData[x][y][2] = 0;
        return;
    }
    uncoverTiles(x,y);
        
    if(tileData[x][y][0]==9){
        console.log("gameOver OVER");
        console.log(x,y);

        revealBombs();
        removeClickFromTiles();
    
        gameOver=true;
    }
}

// using backtraking to unreveal tiles with 0 and their nebors
function uncoverTiles(x,y){
    tile = document.getElementById(setId(x,y));
    if(tileData[x][y][1]==1){
        return;
    }
    tile.style.backgroundImage= tileImg[tileData[x][y][0]];
    tileData[x][y][1] = 1;

    if(tileData[x][y][0] != 0){
        return;
    }
    for(let i=0;i<check.length;i++){
        let tempX=x+check[i][0],tempY=y+check[i][1];

        if(tempX > -1 && tempY >-1 && tempX <rows && tempY < columns  ){
            if(tileData[tempX][tempY][0] == 0){
                uncoverTiles(tempX,tempY);
            }
            else if(tileData[tempX][tempY][0] != 9){
                tile = document.getElementById(setId(tempX,tempY));
                tile.style.backgroundImage= tileImg[tileData[tempX][tempY][0]];
                tileData[tempX][tempY][1] = 1;
            }
        }
    }
    
    
}


function onRightclick(tile,x,y){
    if(tileData[x][y][1] != 0){
        return;
    }
    if(tileData[x][y][2] == 0){
        tile.style.backgroundImage = flagedTile;
        tileData[x][y][2] = 1;
    }
    else if(tileData[x][y][2] == 1){
        tile.style.backgroundImage = unRevealedTile;
        tileData[x][y][2] = 0;
    }
}




// removes click responce after lose
function removeClickFromTiles(){
    console.log("removeClickFromTiles");
    
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            document.getElementById(setId(r,c)).removeEventListener("mouseup",clickTile);
            document.getElementById(setId(r,c)).removeEventListener("mousedown",hope);

        }
    } 
}

function revealBombs(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            if(tileData[r][c][0]==9){
                document.getElementById(setId(r,c)).style.backgroundImage = tileImg[10];
            }
        }
    }
}

// restart game
function reset(){
    if(!gameOver){
        return;
    }
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            let tile = document.getElementById(setId(r,c));
            tile.addEventListener("mouseup",clickTile);
            tile.style.backgroundImage= unRevealedTile;
            
        }
    }
    
    firstClicked = false;
}




// display slected size and updating gmae window
function showRowAndCol(){
    // console.log(row.value);
    sliderRowShow.innerText = row.value ;
    sliderColShow.innerText = col.value ;
    rows = row.value;
    columns = col.value;
    board.innerText = "";
    startGame();
    firstClicked = false;

}




