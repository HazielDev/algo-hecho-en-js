<script>
    import { MapPinIcon, Menu, XIcon, Search } from 'lucide-svelte';
    export let open = false;
</script>

{#if open}
    <aside>
        <button class="btn-close" onclick={()=>{open=false;}}><XIcon /></button>
        <h1><MapPinIcon /> MapSearcher</h1>
        <div class="search-container">

            <input type="text" class="search-bar" placeholder="Buscar">
            <button class="search-btn">
                <Search />
            </button>
        </div>
    </aside>
{:else}
    <button class="btn-open" onclick={()=>{open=true;}}>
        <Menu />
    </button>
{/if}

<style>
  aside {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 30%;
    z-index: 99999;
    background-color: #fff;
    animation: in-right 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    color: #333;
    font-size: 28px;

    :global(svg){
      color: red;
    }
  }

  .search-container{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .search-bar{
    width: 200px;
    padding: 8px;
    border: 1px solid lightgray;
    outline: unset;
    border-radius: 4px;
  }

  .search-btn{
    padding: 8px;
    border: 1px solid #333;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-open {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 10px;
    right: 10px;
    height: 50px;
    width: 50px;
    background-color: #fff;
    z-index: 999;
    border: unset;
    border-radius: 50%;
  }

  .btn-close{
    position: absolute;
    left: 4px;
    top: 6px;
    background: unset;
    border: unset;
    cursor: pointer;
  }

  @keyframes in-right{
    from{
        transform: translateX(100%);
    }

    to{
        transform: translateX(0%);
    }
  }

</style>