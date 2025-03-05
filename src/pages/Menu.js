import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Menu() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const querySnapshot = await getDocs(collection(db, "recipes"));
            const recipesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecipes(recipesList);
        };

        fetchRecipes();
    }, []);

    return (
        <div>
            <h1>Menu</h1>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <Link to={`/user-dashboard/menu/recipes/${recipe.id}`}>{recipe.name}</Link> {/* ✅ Correct path */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Menu;


