import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImagePropTypes, LogBox, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//é preciso instalar esse expo-av
import {Audio} from 'expo-av';
//é para poder usar os botões legais
import {AntDesign} from '@expo/vector-icons';
import Player from './Player.js';



export default function App() {

  LogBox.ignoreAllLogs(true);//para ignorar os avisos

  const [audioIndex,setarAudioIndex] = useState(0);

  //estado que mostra se a musica está sendo tocada
  const [playing,setPlaying] = useState(false);
  
  const [audio,setarAudio] = useState(null);

  //estados das musicas
  //como é um vetor, usa o map para "transitar" nele
  const [musicas,setarMusicas] = useState([
    {
        nome: 'The Climb',
        artista: 'Miley Cyrus',
        playing: false,
        file: require('./theClimb.mp3')
        //file: require('./audio.mp3')//usar audio direto dos arquivos
    },

    {
        nome: 'Circus',
        artista: 'Britney Spears',
        playing: false,
        file: {uri:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
    },
    {
      nome: 'Roar',
      artista: 'Katy Perry',
      playing: false,
      file: {uri:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'}
    },
  ]);

  //função para trocar a musica
  //async é pq é de forma assincrona
  const changeMusic = async (id) =>{
      let curFile = null;
      let newMusics = musicas.filter((val,k)=>{
            if(id == k){
                musicas[k].playing = true;
               
                curFile = musicas[k].file;
                setPlaying(true);
                setarAudioIndex(id);
            }
            else{
                musicas[k].playing = false;
            }

            return musicas[k];
      })
      //quando for iniciar uma musica para a anterior
      if(audio != null){
          audio.unloadAsync();
      }

      //tocar o audio
      let curAudio = new Audio.Sound();

      try{
          await curAudio.loadAsync(curFile);
          await curAudio.playAsync();
      }catch(error){}

      setarAudio(curAudio);
      setarMusicas(newMusics);

  }

  return (
    <View style={{flex:1}}>
      <ScrollView style={styles.container}>
          <StatusBar hidden />

          <View style={styles.header}>
            <Text style={{textAlign:'center',color:'white',fontSize:25}}>App Música</Text>
          </View>

          <View style={styles.table}>
              <Text style={{width:'50%',color:'rgb(200,200,200)'}}>Música</Text>
              <Text style={{width:'50%',color:'rgb(200,200,200)'}}>Artista</Text>
          </View>

          {
            //o val serve para andar no vetor e o k para trocar de musica
            musicas.map((val,k)=>{
              if(val.playing){
                return(
                  <View style={styles.table}>
                    <TouchableOpacity onPress={()=>changeMusic(k)}  style={{width:'100%',flexDirection:'row'}}>
                      <Text style={styles.tableTextSelected}><AntDesign name="play" size={15} color="#1DB954" /> {val.nome}</Text>
                      <Text style={styles.tableTextSelected}>{val.artista}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }else{
                return(
                  <View style={styles.table}>
                    <TouchableOpacity onPress={()=>changeMusic(k)} style={{width:'100%',flexDirection:'row'}}>
                      <Text style={styles.tableText}><AntDesign name="play" size={15} color="white" /> {val.nome}</Text>
                      <Text style={styles.tableText}>{val.artista}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }
            })
          }

          <View style={{paddingBottom:200}}></View>        
      </ScrollView>

      <Player playing={playing}  setPlaying={setPlaying} setarAudioIndex={setarAudioIndex} audioIndex={audioIndex} musicas={musicas}
        setarMusicas={setarMusicas} audio={audio} setarAudio={setarAudio}
      ></Player>
    </View>  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222'
  },
  header:{
    backgroundColor:'#1DB954',
    width:'100%',
    padding:20
  },
  table:{//cria uma "linha" em baixo da view
    flexDirection:'row',
    padding:20,
    borderBottomColor:'white',
    borderBottomWidth:1
  },
  tableTextSelected:{width:'50%',color:'#1DB954'},
  tableText:{width:'50%',color:'white'}
});
