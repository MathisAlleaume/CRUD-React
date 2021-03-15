import React, { Component } from "react";
import "./App.scss";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "React Simple CRUD Application",
      act: 0,
      index: "",
      fiches: [],
      categories: [
        {
          id: 1,
          text: "action",
        },
        {
          id: 2,
          text: "aventure",
        },
      ],
      selectedCats: [],
      showFicheForm: false,
      showCatForm: false,
      ficheFormError: false,
    };
  }
  /**
   * Affiche le formulaire d'ajout / modification de fiche.
   * @param {boolean} value - définit si le formulaire est affiché ou non.
   */
  showFicheForm(value) {
    this.setState({
      showFicheForm: value,
    });
    // ferme le formulaire de catégorie si il est ouvert
    if (this.state.showCatForm === true) {
      this.showCatForm(false);
    }
  }

  /**
   * Affiche le formulaire d'ajout / modification de catégories.
   * @param {boolean} value - définit si le formulaire est affiché ou non.
   */
  showCatForm(value) {
    this.setState({
      showCatForm: value,
    });
    // ferme le formulaire de fiche si il est ouvert
    if (this.state.showFicheForm === true) {
      this.showFicheForm(false);
    }
  }

  /**
   * Séléctionne une catégorie pour une fiche
   */
  selectCat() {
    let categorie = {
      id: this.refs.categories.value,
      text: this.refs.categories.selectedOptions[0].text,
    };
    let selected = this.state.selectedCats;
    var exist = false;

    // vérfication de l'éxistence de la catégorie
    for (var i = 0; i < selected.length; i++) {
      if (selected[i].id === categorie.id) {
        //la catégorie existe => ne rien faire
        exist = true;
        break;
      } else {
        //la catégorie n'existe => ajout au tableau
        exist = false;
      }
    }

    if (exist === false) {
      selected.push(categorie); // ajout au tableau
    }
    this.setState({
      selectedCats: selected,
    });
  }

  /**
   * désolectionne la catégorie cliquée et enleve le focus du form multiselect
   * @param {int} j - index de la catégorie
   */
  deselectCat(j) {
    this.refs.categories.value = null;
    let selectedCats = this.state.selectedCats;
    selectedCats.splice(j, 1);
    this.setState({
      selectedCats: selectedCats,
    });
    this.refs.categories.blur();
  }

  /**
   * Créé et ajoute la fiche au tableau de fiches à partir des champs du forumulaire
   * @param {*} e
   * @returns false si les champs ne sont pas remplis
   */
  fSubmit = (e) => {
    e.preventDefault();

    let fiches = this.state.fiches;
    let title = this.refs.title.value;
    let desc = this.refs.desc.value;
    let categories = this.state.selectedCats;

    // vérification de la complétion des champs du formulaire
    if (!title || !desc || categories.length === 0) {
      this.setState({
        ficheFormError: true,
      });
      return false;
    }

    if (this.state.act === 0) {
      //nouvelle fiche
      let fiche = {
        title,
        desc,
        categories,
      };
      fiches.push(fiche);
    } else {
      //Modification fiche
      let index = this.state.index;
      fiches[index].title = title;
      fiches[index].desc = desc;
      fiches[index].categories = categories;
    }

    this.setState({
      fiches: fiches,
      act: 0,
      selectedCats: [],
      ficheFormError: false,
    });

    this.refs.myForm.reset();
    this.refs.title.focus();
    this.showFicheForm(false);
  };

  /**
   * Supprime la fiche séléctionée
   * @param {*} i - index de la fiche
   */
  fRemove = (i) => {
    let fiches = this.state.fiches;
    fiches.splice(i, 1);
    this.setState({
      fiches: fiches,
    });

    this.refs.myForm.reset();
    this.refs.title.focus();
  };

  /**
   * Ouvre le formulaire de fiche et remplit les champs avec les données de la fiche séléctionée
   * @param {*} i - index de la fiche
   */
  fEdit = (i) => {
    this.showFicheForm(true);
    setTimeout(() => {
      let fiche = this.state.fiches[i];
      this.refs.title.value = fiche.title;
      this.refs.desc.value = fiche.desc;
      let categories = fiche.categories;

      this.setState({
        act: 1,
        index: i,
        selectedCats: categories,
      });

      this.refs.title.focus();
    }, 1);
  };

  /**
   * Créé et ajoute la catégorie au tableau de catégorie à partir des champs du forumulaire
   * @param {*} e
   * @returns false si les champs ne sont pas remplis
   */
  cSubmit = (e) => {
    e.preventDefault();
    let categories = this.state.categories;
    let text = this.refs.cTitle.value;
    let id = categories[categories.length - 1].id + 1;

    // vérification de la complétion des champs du formulaire
    if (!text) {
      this.setState({
        catFormError: true,
      });
      return false;
    }

    if (this.state.act === 0) {
      //nouvelle fiche
      let categorie = {
        id,
        text,
      };
      categories.push(categorie);
    } else {
      //modification fiche
      let index = this.state.index;
      categories[index].text = text;
    }

    this.setState({
      categories: categories,
      catFormError: false,
      act: 0,
    });
    this.refs.myForm.reset();
    this.showFicheForm(false);
  };

  /**
   * Supprime la catégorie séléctionée
   * @param {*} i - index de la catégorie
   */
  cRemove = (i) => {
    let categories = this.state.categories;
    categories.splice(i, 1);
    this.setState({
      categories: categories,
    });

  };

  /**
   * Ouvre le formulaire de catégorie et remplit les champs avec les données de la catégorie séléctionée
   * @param {*} i - index de la catégorie
   */
  cEdit = (i) => {
    this.showCatForm(true);
    setTimeout(() => {
      let categorie = this.state.categories[i];
      this.refs.cTitle.value = categorie.text;

      this.setState({
        act: 1,
        index: i,
      });

      this.refs.cTitle.focus();
    }, 1);
  };

  render() {
    let fiches = this.state.fiches;
    let categories = this.state.categories;
    let selectedCategories = this.state.selectedCats;
    let showFicheForm = this.state.showFicheForm;
    let showCatForm = this.state.showCatForm;
    let catFormError = this.state.catFormError;
    let ficheFormError = this.state.ficheFormError;

    return (
      <div className="App">
        <Row>

          {showFicheForm === true && (
            <Col sm={3}>
              {/* Forrmulaire Fiches */}
              <Card bg="dark">
                <Card.Body>
                  <Form ref="myForm" className="myForm">
                    <Card.Title> Ajouter une fiche: </Card.Title>
                    {ficheFormError == true && (
                      <p className="errorText">
                        Veuillez remplir tout les champs.
                      </p>
                    )}
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label> Titre: </Form.Label>
                      <Form.Control
                        type="text"
                        ref="title"
                        placeholder="Star Wars"
                      />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label> Description: </Form.Label>
                      <Form.Control
                        type="text"
                        as="textarea"
                        rows={4}
                        ref="desc"
                        placeholder="l y a bien longtemps, dans une galaxie très lointaine. La guerre civile fait rage entre l'Empire galactique et l'Alliance rebelle... "
                      />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                      <Form.Label> Catégories: </Form.Label>
                      {selectedCategories.map((selectedCats, j) => (
                        <Badge
                          pill
                          variant="primary"
                          className="categoriesPreview"
                          onClick={() => this.deselectCat(j)}
                        >

                          {selectedCats.text}
                        </Badge>
                      ))}
                      <Form.Control
                        as="select"
                        multiple
                        ref="categories"
                        onChange={() => this.selectCat()}
                      >

                        {categories.map((categorie) => (
                          <option value={categorie.id}>

                            {categorie.text}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Button
                      onClick={(e) => this.fSubmit(e)}
                      className="ActionButtons"
                    >
                      Valider
                    </Button>
                    <Button
                      onClick={() => this.showFicheForm(false)}
                      className="ActionButtons"
                      variant="danger"
                    >
                      Annuler
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Formulaire Catégories */}
          {showCatForm === true && (
            <Col sm={3}>
              <Card bg="dark">
                <Card.Body>
                  <Form ref="myForm" className="myForm">
                    <Card.Title> Ajouter une catégorie: </Card.Title>
                    {catFormError == true && (
                      <p className="errorText">
                        Veuillez remplir tout les champs.
                      </p>
                    )}
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label> Titre: </Form.Label>
                      <Form.Control
                        type="text"
                        ref="cTitle"
                        placeholder="Star Wars"
                      />
                    </Form.Group>
                    <Button
                      onClick={(e) => this.cSubmit(e)}
                      className="ActionButtons"
                    >
                      Valider
                    </Button>
                    <Button
                      onClick={() => this.showFicheForm(false)}
                      className="ActionButtons"
                      variant="danger"
                    >
                      Annuler
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          )}
          <Col>

          {/* Table Fiche */}

            <h1> Fiches: </h1>
            <Button
              className="addButtons"
              size="sm"
              onClick={() => this.showFicheForm(true)}
            >
              Ajouter
            </Button>
            <br />
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th
                    style={{
                      width: 3 + "%",
                    }}
                  >

                    #
                  </th>
                  <th
                    style={{
                      width: 15 + "%",
                    }}
                  >

                    Titre
                  </th>
                  <th
                    style={{
                      width: 60 + "%",
                    }}
                  >

                    Desc
                  </th>
                  <th
                    style={{
                      width: 10 + "%",
                    }}
                  >

                    Catégorie(s)
                  </th>
                  <th
                    style={{
                      width: 12 + "%",
                    }}
                  >

                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>

                {fiches.map((fiche, i) => (
                  <tr>
                    <td> {i + 1} </td> <td> {fiche.title} </td>
                    <td> {fiche.desc} </td>
                    <td>

                      {fiche.categories.map((categorie) => (
                        <>
                          <Badge pill variant="primary">

                            {categorie.text}
                          </Badge>
                          <p> </p>
                        </>
                      ))}
                    </td>
                    <td>
                      <Button
                        className="ActionButtons"
                        size="sm"
                        onClick={() => this.fEdit(i)}
                      >
                        Modifier
                      </Button>
                      <Button
                        className="ActionButtons"
                        size="sm"
                        onClick={() => this.fRemove(i)}
                        variant="danger"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <br />


          {/* Table Catégories */}

            <h1> Categories: </h1>
            <Button
              className="addButtons"
              size="sm"
              onClick={() => this.showCatForm(true)}
            >
              Ajouter
            </Button>
            <br />
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th
                    style={{
                      width: 3 + "%",
                    }}
                  >

                    #
                  </th>
                  <th
                    style={{
                      width: 85 + "%",
                    }}
                  >

                    Catégorie
                  </th>
                  <th> Actions </th>
                </tr>
              </thead>
              <tbody>

                {categories.map((categorie, i) => (
                  <tr>
                    <td> {i + 1} </td> <td> {categorie.text} </td>
                    <td>
                      <Button
                        className="ActionButtons"
                        size="sm"
                        onClick={() => this.cEdit(i)}
                      >
                        Modifier
                      </Button>
                      <Button
                        className="ActionButtons"
                        size="sm"
                        onClick={() => this.cRemove(i)}
                        variant="danger"
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
