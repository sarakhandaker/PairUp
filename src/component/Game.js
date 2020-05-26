import React, { PureComponent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Jumbotron } from 'react-bootstrap'
import ReactCountdownClock from 'react-countdown-clock'

import '../App.css';
import {tiles} from '../data.js'
import Cell from './Cell.js'
// import Countdown from './Countdown'


const URL = "localhost:3000"


class Game extends PureComponent {

  constructor(props) {
     super(props)
    
      this.state = {
        set: "colors",

        board: tiles,
        choice: null,
        matched: [],
        score: 0,
        time: 0,
        difficulty: 60,
        timesUp: true,
      }
  }

  componentDidMount(){
    this.prepGameBoard() 
    this.postNewUserGame()
    this.setState({time: Date.now()})
  }

  postNewUserGame = () => {
    let token = localStorage.getItem('token');    
    fetch('http://localhost:3000/api/v1/newgame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user: {
          game_type: "1"                                         //look at how to handle game difficulty level
        }      
      })     
    })
    .then(res => res.json())
    .then(userGameData => this.storeUserGame(userGameData))
  }

  patchUserGame = () => {
    let token = localStorage.getItem('token');  
    let user_game = JSON.parse(localStorage.getItem('user_game'))
    user_game.score = this.state.score                          // multiplier?
    user_game.timer =  10                                       // difficulty time - leftover timer time


    fetch('http://localhost:3000/api/v1/updategame', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user: {
          user_game: user_game                                  //look at how to handle game difficulty level
        }      
      })     
    })
    .then(res => res.json())
    .then(json => console.log(`Updated db with: ${json}`))

  }

  storeUserGame = (userGameData) => {    
    localStorage.setItem("user_game", JSON.stringify(userGameData.created_UserGame))
  }


  setChoice = (cell) =>{

    if (!this.state.timesUp){
    if (!this.state.matched.includes(cell)){

    this.setState ({     
      board:this.state.board.map(card => {
      if (card === cell) {
        card.flipped = true
      }
      return card
      })
    })


    let pair = this.state.choice
    if (!pair) {
      this.setState({choice:cell })}
    else {                                  //get timer's previous state and pass it forward into render?
      setTimeout(() => {
      if ((pair.word === cell.word) && (pair.id !== cell.id)){
        console.log(`They match!`)
        this.setState({score: this.state.score + 1, 
          matched:[...this.state.matched, pair, cell]})
          this.isAWin()
      }
      else {
        console.log(`They don't match!`)
        this.setState ({ 
          board:this.state.board.map(card => {
            if ((card === cell) || (card === pair)) {
              card.flipped = false
            }
            return card
          })
        })  
      }}, 750)

      setTimeout(() => {this.setState({choice:null})}, 200)
    }  }

    else { console.log(`This card has already been matched!`)}}
  }

  isAWin = () => {
    if ((this.state.score * 2) === this.state.board.length){

      //final calculations
      let elapsedTime = Date.now() - this.state.time
      let balancedScore = parseInt((this.state.score / this.state.difficulty) * 100)        
      this.setState({time: elapsedTime, score: balancedScore})     

      //call win image!

      //update database
      this.patchUserGame()

      //refresh board
      this.setState({board:[], score:0, difficulty:60, time:0})
      this.setState({board:tiles})
      this.prepGameBoard()

    }
    else {
      return console.log(`Current score: ${this.state.score * 2} / ${this.state.board.length} `)
    }
    
  }

  generateRows = ()=> {
    return this.state.board.map(val => <Cell key={val.id} cellContent={val} onSetChoice={this.setChoice}/>)
  }

  
//   handleTiles = (choice) => {
//     console.log(`Chose ${choice.target.value}`)
//     this.setState({set:choice.target.value}, 
//         this.setState({board: [...this.state.board.filter(item => {if (item.category === this.state.set) {return item}})]
//     }))

//   }

  changeTimer = (choice) => {
    let level = choice.target.value
    let time = 0
    switch (level) {
        case 'Easy':
          time=60
          break;
        case 'Medium':
          time=40
          break
        case 'Hard':
          time=20
          break;
        default:
          console.log(`Input Failure`);
    }
    console.log(`Start: ${Date.now()}`)
    this.setState({difficulty:time, timesUp:false, time: Date.now()})

  }

//   newGame = (event) => {
//     event.preventDefault()
//     console.log(`Resetting board and score`)
//     this.setState({board:[], score:0})  
//     console.log(`Refreshing tile selection`)
//     this.setState({board:tiles})
//     console.log(`Choosing tiles`)
//     this.prepGameBoard()
//   } 

  gameEndsWithTimeOut = () => {
    //final calculations
    let elapsedTime = Date.now() - this.state.time
    let balancedScore = parseInt((this.state.score / this.state.difficulty) * 100)        
    this.setState({time: elapsedTime, score: balancedScore, timesUp: true})     
  }


  prepGameBoard = () => {
    
    let local = []
    let temp = []

    for (let i=0; i < 8; i++){
      let choose = this.state.board[Math.floor(Math.random() * this.state.board.length)]
      if (!temp.includes(choose)){
        temp.push(choose)
        let {flipped, word, image} = choose
        let a = {flipped: flipped, word: word, image:image, id:(i+"a")}
        let b = {flipped: flipped, word: word, image:image, id:(i+"b")}
        local.push(a,b)
      } else { i-- }
    }

    //Fisher-Yates Shuffle Algorithm!
    for (let i= local.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * i)
        const temp = local[i]
        local[i] = local[j]
        local[j] = temp
    }
    this.setState({board:local, timesUp:false})
  }

  startGame = () => {
      return (
        <div>
          <div>
           <form  >
            {/* Choose a Tile Set
            <select onChange={this.handleTiles}>
              <option value="Default">Default</option>
              <option value="shapes">Shapes</option>
              <option value="colors">Colors</option>
            </select> */}
            {/* <input type="button" value="Start Game!" onClick={this.newGame}/> */}
            Choose the Game Difficulty
            <select name="time" onChange={this.changeTimer}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                {/* <option value="20000">Extreme</option> */}
            </select>
            </form>
            <ReactCountdownClock seconds={this.state.difficulty} color="#cd4b4b" alpha={0.9} size={75} onComplete={this.gameEndsWithTimeOut} />
          </div>
          <h2>Score: {this.state.score}</h2>
          <div className="board"> {this.generateRows()} </div>
        </div>
    )
  }

  render() {
      return (
          <div>
            <Container>
                {/* <Jumbotron> */}
                {this.startGame()}
                {/* </Jumbotron> */}
            </Container> 
        </div>
      )
  }
}


export default Game