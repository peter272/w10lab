import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../database.service";
import { isNgTemplate } from '../../../node_modules/@angular/compiler';
@Component({
  selector: "app-actor",
  templateUrl: "./actor.component.html",
  styleUrls: ["./actor.component.css"],
})
export class ActorComponent implements OnInit {
  actorsDB: any[] = [];
  section = 1;
  selection = 1;
  fullName: string = "";
  bYear: number = 0;
  actorId: string = "";
  //movies
  movieDB: any[] = [];
  title:string= '';
  year:number = 0;
  movieId:string = '';
  aYear:number=0;

  constructor(private dbService: DatabaseService) {}
  //Get all Actors
  onGetActors() {
    this.dbService.getActors().subscribe((data: any[]) => {
      this.actorsDB = data;
    });
  }
  //Create a new Actor, POST request
  onSaveActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.createActor(obj).subscribe(result => {
      this.onGetActors();
    });
  }
  // Update an Actor
  onSelectUpdate(item) {
    this.fullName = item.name;
    this.bYear = item.bYear;
    this.actorId = item._id;
  }
  onUpdateActor() {
    let obj = { name: this.fullName, bYear: this.bYear };
    this.dbService.updateActor(this.actorId, obj).subscribe(result => {
      this.onGetActors();
    });
  }
  //Delete Actor
  onDeleteActor(item) {
    this.dbService.deleteActor(item._id).subscribe(result => {
      this.onGetActors();
    });
  }
  // This lifecycle callback function will be invoked with the component get initialized by Angular.
  ngOnInit() {
    this.onGetActors();
    this.onGetMovies();
  }
  changeSection(sectionId) {
    this.section = sectionId;
    this.resetValues();
  }
  resetValues() {
    this.fullName = "";
    this.bYear = 0;
    this.actorId = "";
    this.title = '';
    this.year=0;
    this.aYear=0;

  }
  //PART 5: list Movies
  onGetMovies() {
    this.dbService.getMovies().subscribe((data: any[]) => {
      this.movieDB = data;
    });
  }
  //PART 1: create new movie
  onSaveMovie() {
    let obj = { title: this.title, year: this.year };
    this.dbService.createMovie(obj).subscribe(result => {
      this.onGetMovies();
    });
  }
  //PART 2: Delete a movie
  onDeleteMovie(item) {
    this.dbService.deleteMovie(item._id).subscribe(result => {
      this.onGetMovies();
    });
  }
  //PART 3: Delete by Year
  onDeleteMovieYear() {
    this.dbService.deleteMovieYear(this.aYear).subscribe(result => {
      this.onGetMovies();
    });
  }


  onActorId(item){
    this.actorId= item._id
  }
  onMovieId(item){
    this.movieId= item._id
  }
  onAddActor(){
    this.dbService.AddActor(this.movieId, this.actorId).subscribe(result => {
      this.onGetMovies();
    });
  }
}