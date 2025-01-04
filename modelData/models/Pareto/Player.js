include("{script}/Tile.js");

class Player extends ABMAgent{
    static Owns = "owns";
    static RoundCoins = 75;
    
    coins;
    
    setup():Player{
        this.coins = 1;
        this.size = 1;
        this.color = rgbColor(
                30 +randomInt(225),
                30 +randomInt(225),
                30 +randomInt(225));
        this.setRandomPatch();
        return this;
    }
    
    step() {
        this.coins += Player.RoundCoins;
        const tile = this.setRandomPatch();
        
        if (tile.hasOwner()){
            const owner = tile.getOwner();
            if (owner !== this){
            //println("This "+(this.id-99) +" owner "+(tile.getOwner().id-99)+" tile "+tile.idx+" coins "+
            //owner.coins+" rent "+tile.rent+ " "+tile.cost +" "+this.coins)
                if (tile.rent <= this.coins){
                    owner.coins+=tile.rent;
                    this.coins-=tile.rent;
                }else {
                    const remainingDebt = tile.rent - this.coins;
                    owner.coins+=this.coins;
                    this.coins=0; 
                    this.settle(owner, remainingDebt);
                }
            }
        } else {
            if (tile.cost <= this.coins){
                //println("Player "+(this.id-99)+" buying "+tile.idx+ " cost "+tile.cost)
                this.coins -= tile.cost;
                --this.env.availableTiles;
                tile.color = this.color;
                this.createRelation(Player.Owns, tile);
                tile.createRelation(Tile.Owner, this);
            }
        }
        this.improve();
    }
    
    settle(newOwner:Player, remainingDebt:Number):void{
        //println("Settle "+(this.id-99)+" "+(newOwner.id-99)+" "+remainingDebt);
        if (remainingDebt <= 0){
            return;
        }
        if (this.ownsTiles()){
            const thisRelTiles = this.getRelationsList(Player.Owns).sort(
                (tileA: ABMRelation,tileB:ABMRelation):Number=>
                    tileA.dest.cost - 
                    tileB.dest.cos
            );
            let ownedTiles = [];
            let amount = 0;
            for (const tileRel of ownedTiles){
                amount += tileRel.cost;
                ownedTiles.push(tileRel);
                if (amount>=remainingDebt){
                    break;
                }
            }
            let counter = 0;
            for (const tileRel of ownedTiles){
                let newAmount = amount - tileRel.cost;
                if (newAmount > remainingDebt) {
                    amount = newAmount;
                    ++counter;
                } else {
                    break;
                }
            }
            for (;counter < ownedTiles.length;++counter){
                
                const lostTile = ownedTiles[counter];
                println(lostTile.cost)
                lostTile.dropAllRelations();
                newOwner.createRelation(Player.Owns,lostTile);
                lostTile.createRelation(Tile.Owner, newOwner);
                lostTile.color = newOwner.color;
            }
            println("");
        }
    }
    
    improve():void{
        if (this.ownsTiles()){
            const cheapestTile = this.cheapestTile();
            if (cheapestTile.cost <= this.coins){
                //println("Player "+(this.id-99)+" improving tile "+cheapestTile.idx+" coins "+this.coins+" cost "+cheapestTile.cost);
                this.coins-=cheapestTile.cost;
                cheapestTile.cost *=2;
                cheapestTile.rent *=2;
                //Try again
                this.improve();
            }
        }
    }
    
    ownsTiles():Boolean{
        return this.getRelationsCount(Player.Owns) > 0;   
    }
    
    cheapestTile():Tile{
        
        return arrayToList(this.getRelationsList(Player.Owns)).worst((relation:ABMRelation):Number=>{
            return relation.dest.cost; 
        }).dest;
    }

}