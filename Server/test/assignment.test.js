const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Assurez-vous d'importer votre application correctement
const expect = chai.expect;

chai.use(chaiHttp);

describe('Affectations', () => {
  // Cette variable stockera l'ID de l'affectation créée pour les tests ultérieurs
  let assignmentId;

  it('Devrait retourner toutes les affectations', (done) => {
    chai
      .request(app)
      .get('/assignments')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Devrait créer une affectation', (done) => {
    const newAssignment = {
      user: 'ID_utilisateur',
      hardware: 'ID_matériel',
      software: 'ID_logiciel',
      // Autres données nécessaires pour créer une affectation
    };

    chai
      .request(app)
      .post('/assignments')
      .send(newAssignment)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('_id');
        assignmentId = res.body._id; // Stockez l'ID pour les tests ultérieurs
        done();
      });
  });

  it('Devrait récupérer une affectation par son ID', (done) => {
    chai
      .request(app)
      .get(`/assignments/${assignmentId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id').equal(assignmentId);
        done();
      });
  });

  it('Devrait mettre à jour une affectation', (done) => {
    const updatedAssignment = {
      user: 'ID_utilisateur_mis_à_jour',
      hardware: 'ID_matériel_mis_à_jour',
      software: 'ID_logiciel_mis_à_jour',
      // Autres données mises à jour
    };

    chai
      .request(app)
      .put(`/assignments/${assignmentId}`)
      .send(updatedAssignment)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user').equal(updatedAssignment.user);
        done();
      });
  });

  it('Devrait supprimer une affectation', (done) => {
    chai
      .request(app)
      .delete(`/assignments/${assignmentId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
