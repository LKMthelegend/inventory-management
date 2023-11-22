const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assurez-vous d'importer votre application correctement
const expect = chai.expect;

chai.use(chaiHttp);

describe('Utilisateurs', () => {
  // Cette variable stockera l'ID de l'utilisateur créé pour les tests ultérieurs
  let userId;

  it('Devrait retourner tous les utilisateurs', (done) => {
    chai
      .request(app)
      .get('/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Devrait créer un utilisateur', (done) => {
    const newUser = {
      username: 'utilisateur_test',
      email: 'utilisateur_test@example.com',
      password: 'motdepasse_test',
      // Autres données nécessaires pour créer un utilisateur
    };

    chai
      .request(app)
      .post('/users')
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        userId = res.body._id; // Stockez l'ID pour les tests ultérieurs
        done();
      });
  });

  it('Devrait récupérer un utilisateur par son ID', (done) => {
    chai
      .request(app)
      .get(`/users/${userId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id').equal(userId);
        done();
      });
  });

  it('Devrait mettre à jour un utilisateur', (done) => {
    const updatedUser = {
      username: 'utilisateur_test_modifié',
      // Autres données mises à jour
    };

    chai
      .request(app)
      .put(`/users/${userId}`)
      .send(updatedUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('username').equal(updatedUser.username);
        done();
      });
  });

  it('Devrait supprimer un utilisateur', (done) => {
    chai
      .request(app)
      .delete(`/users/${userId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
