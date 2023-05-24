import AddRecipe from "@component/components/AddRecipe";
import Modal from "@component/components/Modal";
import RecipeGridCard from "@component/components/RecipeGridCard";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import styles from "../styles/RecipesPage.module.css";
import axios from "axios";
import { GetServerSideProps } from "next";

type Recipe = {
  name: string;
  prepTime: string;
  cookTime: string;
  ingredients: string;
  directions: string;
  cuisine: string;
  image: string;
};

type RecipesPageProps = {
  user_email: string;
};

const RecipesPage = ({ user_email }: RecipesPageProps) => {
  const [openRecipeForm, setOpenRecipeForm] = useState(false);
  const [searchTerms, setSearchTerms] = useState("");
  const [allRecipes, setAllRecipes] = useState<Recipe[] | undefined>();
  const [recipes, setRecipes] = useState<Recipe[] | undefined>();

  console.log("recs", recipes);

  const onClose = () => {
    setOpenRecipeForm(false);
  };

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(event.target.value);
    console.log(searchTerms);
    let filteredRecipes;
    if (searchTerms.length > 0) {
      filteredRecipes = recipes?.filter(
        (recipe) =>
          recipe.name.includes(searchTerms) ||
          recipe.ingredients.includes(searchTerms) ||
          recipe.cuisine.includes(searchTerms)
      );
    } else {
      //console.log(allRecipes);
      filteredRecipes = allRecipes;
    }
    setRecipes(filteredRecipes);
  };

  let recipeCards: ReactElement[] = [];

  const getRecipes = async () => {
    let recipes: any;
    try {
      recipes = await axios.get("http://localhost:8000/getAllRecipes", {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
    setAllRecipes(recipes ? recipes.data : []);
    setRecipes(recipes ? recipes.data : []);
  };

  useEffect(() => {
    getRecipes();
  }, []);

  recipeCards = recipes
    ? recipes.map((recipe) => (
        <RecipeGridCard name={recipe.name} imageUrl={recipe.image} />
      ))
    : [];

  return (
    <div className={styles.recipes}>
      {openRecipeForm && (
        <Modal onClose={onClose}>
          <AddRecipe onClose={onClose} getRecipes={getRecipes} />
        </Modal>
      )}
      <h1 className={styles.heading}>Your Recipes</h1>
      <div className={styles["search-container"]}>
        <input
          type="text"
          id="search-receipes"
          className={styles.search}
          placeholder="Find a receipe! Search recipes by name, cuisine, or ingredients..."
          value={searchTerms}
          onChange={handleSearchTermChange}
        />
        <button className={styles.clear} onClick={() => setSearchTerms("")}>
          x
        </button>
      </div>

      <button
        className={styles["add-button"]}
        onClick={(event) => {
          event.preventDefault();
          setOpenRecipeForm(true);
        }}
      >
        Add Recipe
      </button>
      <section className={styles["recipe-grid"]}>
        {recipeCards}
        {/* <RecipeGridCard name="Meatloaf" imageUrl="" />
        <RecipeGridCard name="Chicken Parm" imageUrl="" /> */}
      </section>
    </div>
  );
};

export default RecipesPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user_email = context.req.cookies.user;
  if (!user_email) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {
      user_email,
    },
  };
};
