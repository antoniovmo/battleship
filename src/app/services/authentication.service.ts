// Dependencies
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

// Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import {doc, setDoc} from "firebase/firestore";
import {getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';

// Classes
import {User} from '../classes/user';

// Services
import {DatabaseService} from "./database.service";

// RxJS
import {BehaviorSubject} from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {

    m_user: any;
    m_uid: any;
    m_user_snapshot: any;
    m_auth: any;
    m_user_b_subject!: BehaviorSubject<any>;

    constructor(private databaseService: DatabaseService, private router: Router) {
        this.m_auth = getAuth()
        this.m_user_b_subject = new BehaviorSubject<any>(this.m_user);
        this.init_authentication()
    }

    async init_authentication() {
        this.get_database_on_auth((user: any) => {
            if (user) {
                this.m_uid = user.uid;
                this.m_user_snapshot = this.databaseService.m_data_base
                    .collection(this.databaseService.m_collections.users).doc(user.uid).get()
                    .then((r_user: any) => {
                        this.m_user = r_user.data();
                        this.m_user_b_subject.next(this.m_user);
                    });
            } else {
                this.router.navigate(['authentication/log-in']);
            }
        });
    }

    log_in_google() {
        const provider = new GoogleAuthProvider();

        signInWithPopup(this.m_auth, provider).then(async p_user => {
            this.m_user = await this.databaseService.m_data_base.collection(this.databaseService.m_collections.users).doc(p_user.user.uid)
                .get()
                .then((r_user: any) => {
                    if (!r_user.exists) {
                        let r_provider = p_user.user.providerData[0]
                        let temp_user = new User(r_provider.displayName!, r_provider.email!, r_provider.photoURL!, r_provider.providerId)
                        this.m_user_b_subject.next(temp_user);
                        this.save_firestore_user(temp_user, p_user.user.uid)
                        return temp_user
                    } else {
                        return r_user.data();
                    }
                });

            if (this.m_user) {
                await this.router.navigate(['game/home']);
                this.m_user_b_subject.next(this.m_user);
            } else {
                return false;
            }
            return false;
        }).catch((error) => {
            console.log(error)
        });
    }

    log_in_email(r_email: any, r_pass: any) {
       return signInWithEmailAndPassword(this.m_auth,r_email, r_pass).then(async p_user => {
            this.m_uid = p_user.user.uid;

            this.m_user = await this.databaseService.m_data_base.collection('users').doc(this.m_uid)
                .get()
                .then((r_user: any) => {
                    if (!r_user.exists) {
                        let r_provider = p_user.user.providerData[0]
                        let temp_user = new User(r_provider.email!.split("@")[0], r_provider.email!, r_provider.photoURL!, r_provider.providerId)
                        this.m_user_b_subject.next(temp_user);
                        this.save_firestore_user(temp_user, p_user.user.uid)
                        return temp_user
                    } else {
                        return r_user.data();
                    }
                });
            if (this.m_user) {
                await this.router.navigate(['game/home']);
                this.m_user_b_subject.next(this.m_user);
            } else {
                return false;
            }
            return false;
        }).catch(error => {
            console.log(error)
           return error
        });
    }

    register_with_email(r_email: any, r_pass: any) {
       return createUserWithEmailAndPassword(this.m_auth,r_email, r_pass).then(async p_user => {
            this.m_uid = p_user.user.uid;
            let r_provider = p_user.user.providerData[0]
            let temp_user = new User(r_provider.email!.split("@")[0], r_provider.email!, '', r_provider.providerId)
            this.m_user_b_subject.next(temp_user);
            await this.save_firestore_user(temp_user, p_user.user.uid)

            if (this.m_user) {
                await this.router.navigate(['game/home']);
                this.m_user_b_subject.next(this.m_user);
            } else {
                return false;
            }
            return false;
        }).catch(error => {
            console.log(error)
           return error
        });
    }

    async save_firestore_user(r_user: User, r_uid: string) {
        await setDoc(doc(this.databaseService.m_data_base, this.databaseService.m_collections.users, r_uid),
            Object.assign({}, r_user));
    }

    get_database_on_auth(m_function: any) {
        return onAuthStateChanged(this.m_auth, m_function);
    }

    get_database_auth() {
        this.databaseService.database_init();
        return firebase.auth();
    }

    logout() {
        signOut(this.m_auth).then(() => {
            this.router.navigate(['authentication/log-in']).then(r => {
                window.location.reload();
            });
        }).catch((error) => {
            console.log(error)
        });
    }

}
