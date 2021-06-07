import React,{ Component }  from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import  {debounce} from 'lodash';
import Loader from "react-loader-spinner";
import Button from '@material-ui/core/Button';
import axios from 'axios';

import '../../style/style.css'

/*Styles */
const useStyles = theme => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  });

// Canvas Class
 class Canvas extends Component {
     //Constructor
     constructor(props){
         super(props)
         this.imageCanvas=null
         this.textCanvas= null
         this.image=null
         this.backgroundColor=props.backgroundColor
         this.textColor= props.textColor
         //States
         this.state = {
            photos:[], //Image list
             selectedPhoto:{name:"", value:""},
             text:"", //Text on the canvas
             isLoading:false,
             flag:true, //boolean flag to check the canvas type
        }   
    }
    componentDidMount(){ // Call after the first render 
        //Create the canvas
        this.createCanvas(); 
        this.setState({isLoading: true})
        //Get image list from api
        axios.get('http://localhost:3001/imageList').then((response)=>{
            this.setState({photos:response.data})
        }); 
        setTimeout(() => { 
            this.setState({isLoading: false})
         }, 350);
    }
 
    createCanvas() {
        //Set Canvas for images
        this.imageCanvas=document.getElementById('imageCanvas')
        this.imageCanvas.width = 640;
        this.imageCanvas.height = 360;

        //Set Canvas for text
        this.textCanvas=document.getElementById('textCanvas')
        this.textCanvas.width = 640;
        this.textCanvas.height = 360;    
        }

    //Set image on the canvas
    updateImage = async(event) => {
            await this.setState({isLoading:true})
            await this.setState({flag:true})
            var value
            //Find the value(URL) of the selected image
            this.state.photos.forEach(function (data) {
                if(data.name===event.target.value){
                    value=data.value
                }
                
               })
            //Save the selected image 
            await this.setState({selectedPhoto:{name:event.target.value,value:value}},function(){
                const ctx = this.imageCanvas.getContext('2d');               
                ctx.clearRect ( 0 , 0 ,640 , 360 );//Clear the canvas
                this.image = new Image();  //Create new image
                this.image.src = this.state.selectedPhoto.value
                this.image.onload = function() {
                        ctx.fillStyle= this.backgroundColor //Set image loaction
                        var x = (640  - this.width ) * 0.5, 
                            y = (360 - this.height) * 0.5;
                        ctx.drawImage(this, x,y);  //Draw the image on the canas
                }
            this.debounced()
            }          
            )
               console.log(this.state.selectedPhoto.name)
               setTimeout(() => { 
                this.setState({isLoading: false})
                 }, 250);
               event.preventDefault();

        
    }

     //Change the canvas other style
    changeCanvasStyle = async() =>{
           await this.setState({flag:!this.state.flag})
           const canvas =document.getElementById('imageCanvas')
           const ctx = canvas.getContext('2d'); 
           ctx.clearRect ( 0 , 0 ,640 , 360 );//Clear the image canvas
           this.image = new Image();
           this.image.src = this.state.selectedPhoto.value
           //Check the current style
            if (!this.state.flag){ 
                this.setState({isLoading: true})
                //Draw the image on 2/3 of the canvas
                this.image.onload = function() {
                    ctx.fillStyle= "#0284cf"
                     var x =-640/3, y =0; //image position
                    ctx.drawImage(this, x,y,640,360);
            }
            //Write the text on canvas
            this.newDebounced()
            setTimeout(() => { 
                this.setState({isLoading: false})
                 }, 350);
        }
        else{
            this.setState({isLoading: true})
            this.image.onload = function() {
                    ctx.fillStyle= this.backgroundColor //Set image loaction
                    var x = (640  - this.width ) * 0.5, 
                        y = (360 - this.height) * 0.5;
                    ctx.drawImage(this, x,y);  //Draw the image on the canas
            }
            //Write the text on canvas
            this.debounced()
            setTimeout(() => { 
                this.setState({isLoading: false})
                 }, 350);
        }          
        
    }
    

    //This function call to debounce function that set the text on canvas
    setText = async(event) => {
        this.setState({isLoading: true})
        await this.setState({text:event.target.value})  //Save the selected text 
    
        if(!this.state.flag){// Check the canvas style
            this.newDebounced()   //Call to new debounce function for the new text style
        }
        else{
            this.debounced()   //Call to debounce function for the default style
        }
        setTimeout(() => { 
            this.setState({isLoading: false})
         }, 250);
    
        event.preventDefault();

   
    }   


    //Debounce function for set text on canvas
    debounced = debounce(() =>{
            const ctx = this.textCanvas.getContext('2d');
            ctx.clearRect ( 0 , 0 ,640 , 360 ); //Clear the text canvas          
            ctx.textBaseline = 'middle'; 
            ctx.textAlign = 'center'; 
            //Check the length of the text to choose the text size
            if (0<this.state.text.length &&  this.state.text.length<20 ){
                ctx.font = 'bold 60px Helvetica, Inter, sans-serif';
            }
            else if (19 <this.state.text.length && this.state.text.length< 40 ){
                ctx.font = 'bold 50px Helvetica, Inter, sans-serif';
            }
            else if (39<this.state.text.length&& this.state.text.length < 61 ){
                ctx.font = 'bold 40px Helvetica, Inter, sans-serif';
            }
            ctx.fillStyle = this.textColor;
            //Set the text on the text canvas
            var words = this.state.text.split(' '); // Split the text to array of words
            var line = '';
            var maxWidth =620 // Maximum width for writing the text
            var maxHeight = 100; //Maximum Height for writing the text
            var lineHeight = 45; 
            var x = 320 ,y = 180; //Text loaction
            //fill the text on the canvas 
            words.forEach((word) => {
                var testLine = line + word + ' ';
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && maxHeight > 0) {
                  ctx.fillText(line,x,y);
                  line = word + ' ';
                  y += lineHeight;
                  maxHeight-=lineHeight
                }
                else {
                  line = testLine;
                }
        
            });
            ctx.fillText(line, x,y);
        }
    ,500)

    //New debounce function for set text on canvas with the second style
    newDebounced = debounce(() =>{
             //write text in 1/3 of the canvas
            const ctx = this.textCanvas.getContext('2d');
            ctx.clearRect ( 0 , 0 ,640 , 360 );
            ctx.textBaseline = 'middle'; 
            ctx.textAlign = 'center'; 
            //Check the length of the text to choose the text size
            if (0<this.state.text.length &&  this.state.text.length<20 ){
                ctx.font = 'bold 40px Helvetica, Inter, sans-serif';
            }
            else if (19 <this.state.text.length && this.state.text.length< 40 ){
                ctx.font = 'bold 35px Helvetica, Inter, sans-serif';
            }
            else if (39<this.state.text.length&& this.state.text.length < 61 ){
                ctx.font = 'bold 25px Helvetica, Inter, sans-serif';
            }
            ctx.fillStyle =this.textColor;
            var words = this.state.text.split(' '); // Split the text to array of words
            var line = '';
            var maxWidth =640/3 // Maximum width for writing the text
            var maxHeight = 130; //Maximum Height for writing the text
            var lineHeight = 40;
            var x = (640*(2/3)+110),y = 160;  //Text loaction
            //fill the text on the canvas 
            words.forEach((word) => {
                var testLine = line + word + ' ';
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && maxHeight > 0) {
                  ctx.fillText(line,x,y);
                  line = word + ' ';
                  y += lineHeight;
                  maxHeight-=lineHeight 
                }
                else {
                  line = testLine;
                }
            });
            if (line.length < maxWidth){
                ctx.fillText(line, x,y);
            }
          }        
    ,500)

    
    render() {
            const {classes} = this.props;
            return (
            <div className="container" >
                <br/>
            {/*Header*/ }
             <h1>Create your Canvas</h1>
             <hr />
                <form className={classes.root} noValidate autoComplete="off">
                    <div className="center">
                     {/*Dropdown menu of images */ }
                    <TextField
                            id="outlined-select-currency"
                            select
                            label="Select Image"
                            value={this.state.selectedPhoto.name}
                            onChange={this.updateImage}
                            variant="outlined"
                            >
                            {this.state.photos.map((option) => {
                                    return(
                                        <MenuItem key={option.value} value={option.name}>
                                        {option.name}
                                        </MenuItem>
                                    )
                            })}
                  {/*Text input  */ }
                    </TextField>
                    <br/>
                    <TextField id="filled-basic"  label="Set Text" variant="outlined" onChange ={this.setText}
                          inputProps={{ maxLength: 60}}

                    />
                    </div>
                    </form>
                   {/*Button that change the style of the canvas (Bonus)   */ }
                    <Button variant="contained" color="secondary" value= {this.state.photos.value} onClick={this.changeCanvasStyle}>
                    change style               
                    </Button>
                    <hr />
                    {/*Check if the page Is loading and show spinner  */ }
                    {this.state.isLoading ?  <Loader
                        type="ThreeDots"
                        color="#00BFFF"
                        height={30}
                        width={30}
                        />: <div></div>} 
                    {/*Draw two canvases, obe for the images and one for the text  */ }
                    <div className="canvasLayer ">
                        <canvas id="imageCanvas" style={{background:this.backgroundColor}} className="canvasStyle"> </canvas>
                      <canvas id="textCanvas" className="canvasStyle"> </canvas>
                    </div>
                </div>
            );
    }
};

export default withStyles(useStyles)(Canvas);
