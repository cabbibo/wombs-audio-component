
  var Component = require( 'wombs-component' );
  var Texture = require( 'wombs-audio-texture' );
  var _ = require( 'underscore' );
 

  var mutate = {};


  // mutes output
  mutate.mute = function(){
    this.output.gain.value = 0;
  }

  mutate.unmute = function( value ){
    value = value || 1;
    this.output.gain.value = value;
  }

  // silences input
  mutate.silence = function(){
    this.input.gain.value = 0;
  }
  
  mutate.unsilence = function(){
    value = value || 1;
    this.input.gain.value = value;
  }

  // Moves things out of this 
  mutate.import = function( node ){
    node.connect( this.input );
  }

  mutate.export = function( node ){
    this.output.connect( node );
  }



  //creates an analyser with which ever input desired 
  mutate.createAnalyser = function( fbc , i ){

    fbc = fbc ||  1024 * 2;
    i = i || this.input;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.array = new Uint8Array( fbc / 2 );

    i.connect( this.analyser );

  }

  mutate.insertNode = function( node , i , o ){

    console.log( node );
    console.log( i );
    console.log( o );

    i = i || this.input;
    o = o || this.output;

  }
  
  mutate.setFrequencyBinCount = function( fbc , i ){
 
    this.createAnalyser( fbc , i );

    if( this.texture ){
      this.texture.reset();
    }

  }


  // You can create a texture using any analyser,
  // and title it anything, but by default, 
  // there should be one this.texture, if you are
  // trying to do it simply
  mutate.createTexture = function( analyser , title  ){

    title = title || 'texture'
    this[title] = new Texture( analyser );
    this.addComponent( this[title] );

  }
  

  AudioComponent.prototype = _.extend( 
      Component.prototype, 
      mutate 
  );

  function AudioComponent( parentNode ){

    Component.call( this );

    this.ctx = parentNode.ctx;
    this.parentNode = parentNode;

    this.input = this.ctx.createGain();
    this.output = this.ctx.createGain();

    this.input.connect( this.output );
    this.export( parentNode.input );

    this.addToUpdateArray( function(){

      if( this.analyser ){
         this.analyser.getByteFrequencyData( this.analyser.array );
      }

    });


  }

  module.exports = AudioComponent;
