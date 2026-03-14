class SaveManager{
    constructor(){
        this.key = "gamedata";
    }

    load(){
        let raw = localStorage.getItem(this.key);
        if(raw) return JSON.parse(raw);
        return {clearedLevels: []};
    }

    completeLevel(level){
        let data = this.load();
        if(!data.clearedLevels.includes(level)){
            data.clearedLevels.push(level);
            localStorage.setItem(this.key, JSON.stringify(data));
        }

    }

    isCleared(level){
        let data = this.load();
        return data.clearedLevels.includes(level);
    }

    isUnlocked(level){
        if (level === 1) return true;
        return this.isCleared(level - 1);
    }

    clear() {
        localStorage.removeItem(this.key);
    }


}