import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function Menu() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const querySnapshot = await getDocs(collection(db, "recipes"));
            const recipesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecipes(recipesList);
        };
        fetchRecipes();
    }, []);

    return (
        <div>
            <h2>Menu</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Menu;
