class Start extends Scene {
    
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
        
    }

    handleChoice() {
        this.engine.show("You wake up on the ground. The cold smooth surface makes you feel chilly but somehow at ease.<br><br>");

        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story

    }
}

class Location extends Scene {
    create(key) {
        console.log(this.engine.storyData.Items);
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        if(!this.engine.storyData.Visited[key]){
            this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
            this.engine.storyData.Visited[key] = true;
        }
        
        if(!locationData.IsInventory){
            this.engine.addChoice(this.engine.storyData.GlobalButtons[0].Text,this.engine.storyData.GlobalButtons[0]);
            this.engine.storyData.GlobalButtons[0].PastLocation = key;
        }
        else{
            this.engine.show("You're currently holding: ");
            for(let i = 0; i < 3; i++){
                if(this.engine.storyData.Locations.RemoveItem.Choices[i].Text){
                    this.engine.show(this.engine.storyData.Locations.RemoveItem.Choices[i].Text + " ");
                    
                }
            }
            for(let choice of locationData.Choices){
            choice.Target = this.engine.storyData.GlobalButtons[0].PastLocation;
            }

            

        }
/*
        if(locationData.FoundCrowbar){
            console.log(this.engine.storyData.Items.FoundCrowbar)
            this.engine.storyData.Items.FoundCrowbar = true;
        }*/
        
        if(locationData.Choices) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                //hidden actions
                if(choice.RequiredInfo){
 
                    if(this.engine.storyData.Information[choice.RequiredInfo]&& !this.engine.storyData.Items[choice.Item]){
                        this.engine.addChoice(choice.Text,choice);
                    }
                    
                }
                else if(choice.RequiredItem && choice.Item){
                    if(this.engine.storyData.Items[choice.RequiredItem] &&!this.engine.storyData.Items[choice.Item]){
                        this.engine.addChoice(choice.Text,choice);
                    }
                }
                else if(choice.RequiredItem){
                    if(this.engine.storyData.Items[choice.RequiredItem]){
                        
                        this.engine.addChoice(choice.Text,choice);
                    }
                }
                else if(choice.Item){
                    if(choice.Item && !this.engine.storyData.Items[choice.Item]){
                        console.log(this.engine.storyData.Items[choice.Item])
                        this.engine.addChoice(choice.Text,choice);
                    }
                }
                else if(choice.Info){
                    if(choice.Info && !this.engine.storyData.Information[choice.Info]){
                        this.engine.addChoice(choice.Text,choice);
                    }
                }
                else{
                    
                    this.engine.addChoice(choice.Text,choice); // TODO: use the Text of the choice
                }
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
                
            }
            
        } else {
            this.engine.addChoice("The end.")
        }
        
    }

    handleChoice(choice) {
        if(choice) {
            //console.log(this.engine.storyData.Locations.RemoveItem.Choices);
            if(choice.Item){
                if(this.engine.storyData.GlobalButtons[0].CurrInvSize > this.engine.storyData.GlobalButtons[0].MaxInvSize){
                    this.engine.gotoScene(Location,"RemoveItem");
                    this.engine.storyData.GlobalButtons[0].CurrInvSize--;
                    //console.log("num lowered");
                    //console.log(choice.Item);
                    this.engine.storyData.Items[choice.Item] = true;
                    return;
                }
                
                this.engine.storyData.Items[choice.Item] = true;
                 
                this.engine.storyData.Locations.RemoveItem.Choices[this.engine.storyData.GlobalButtons[0].CurrInvSize].Text = choice.Item;
                this.engine.storyData.GlobalButtons[0].CurrInvSize++;
                
            }
            if(choice.Remove){
                //console.log(choice);
                this.engine.storyData.Items[choice.Text] = false;
                
                let counter = 0;

                for(let item in this.engine.storyData.Items){
                    //console.log(item);
                    if(this.engine.storyData.Items[item] == true){
                        //console.log("added " + item);
                        this.engine.storyData.Locations.RemoveItem.Choices[counter].Text = item;
                        counter++;
                    }
                }
                this.engine.storyData.GlobalButtons[0].CurrInvSize++;
            }
            if(choice.Info){
                this.engine.storyData.Information[choice.Info] = true;
            
            }
            this.engine.show("&gt; "+ choice.Text);
            this.engine.gotoScene(Location, choice.Target);
            
            
        } else {
            this.engine.gotoScene(End);
        }
        window.scrollTo(0, document.body.scrollHeight);
        
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
