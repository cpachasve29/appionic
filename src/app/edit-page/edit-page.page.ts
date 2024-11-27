import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../models/post.model';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.page.html',
  styleUrls: ['./edit-page.page.scss'],
})
export class EditPagePage implements OnInit {

  post = {} as Post;
  id: any;

  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(post: Post) {
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Espere un momento, por favor..."
      });

      await loader.present();

      this.firestore.doc("posts/"+ this.id)
      .valueChanges().subscribe((data: any) => {
        const{title, details} = data as {title: string, details: string};
        this.post.title = data.title;
        this.post.details = data.details;

        loader.dismiss();
      })

      await loader.dismiss();

    }
  }

  async updatePost(post: Post) {
    if (this.formValidation()) {
      let loader = await this.loadingCtrl.create({
        message: "Actualizando..."
      });

      await loader.present();

      this.firestore.doc("posts/"+ this.id)
      .update(post).then(() => {
        console.log("Elemento actualizado correctamente");
        this.router.navigate(['/home']);
        loader.dismiss();
      })
      .catch((error) => {
        console.error("Error al actualizar elemento: ", error);
        loader.dismiss();
      });

    }
  }

  formValidation() {
    if (!this.post.title) {
      this.showToast("Ingrese un título");
      return false;
    }

    if (!this.post.details) {
      this.showToast("Ingrese una descripción");
      return false;
    }

    return true;
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 5000
    }).then(toastData => toastData.present());
  }


}
