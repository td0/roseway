<template>
  <div class="app-viewport" id="file-list">
    <md-sidenav class="md-left md-fixed" ref="sidebar">
      <md-toolbar class="md-account-header">
        <md-list class="md-transparent">
          <md-list-item class="md-avatar-list">
            <md-avatar class="md-large">
              <img src="https://placeimg.com/64/64/people/8" alt="People">
            </md-avatar>

            <span style="flex: 1"></span>

            <md-avatar>
              <img src="https://placeimg.com/40/40/people/3" alt="People">
            </md-avatar>

            <md-avatar>
              <img src="https://placeimg.com/40/40/people/4" alt="People">
            </md-avatar>
          </md-list-item>

          <md-list-item>
            <div class="md-list-text-container">
              <span>John Doe</span>
              <span>johndoe@email.com</span>
            </div>

            <md-button class="md-icon-button md-list-action">
              <md-icon>arrow_drop_down</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
      </md-toolbar>

      <md-list>
        <md-list-item @click="$refs.sidebar.toggle()" class="md-primary">
          <md-icon>insert_drive_file</md-icon> <span>My files</span>
        </md-list-item>

        <md-list-item @click="$refs.sidebar.toggle()">
          <md-icon>people</md-icon> <span>Shared with me</span>
        </md-list-item>

        <md-list-item @click="$refs.sidebar.toggle()">
          <md-icon>access_time</md-icon> <span>Recent</span>
        </md-list-item>

        <md-list-item @click="$refs.sidebar.toggle()">
          <md-icon>start</md-icon> <span>Starred</span>
        </md-list-item>

        <md-list-item @click="$refs.sidebar.toggle()">
          <md-icon>delete</md-icon> <span>Trash</span>
        </md-list-item>
      </md-list>
    </md-sidenav>

    <md-whiteframe md-elevation="3" class="main-toolbar">
      <md-toolbar class="md-large">
        <div class="md-toolbar-container">
          <md-button class="md-icon-button" @click="$refs.sidebar.toggle()">
            <md-icon>menu</md-icon>
          </md-button>

          <span style="flex: 1"></span>

          <md-button class="md-icon-button">
            <md-icon>search</md-icon>
          </md-button>

          <md-button class="md-icon-button">
            <md-icon>view_module</md-icon>
          </md-button>
        </div>

        <div class="md-toolbar-container">
          <h2 class="md-title">My Files</h2>

          <md-button class="md-fab md-mini">
            <md-icon>add</md-icon>
          </md-button>
        </div>
      </md-toolbar>
    </md-whiteframe>

    <main class="main-content">
      <md-list class="md-double-line">
        <md-subheader class="md-inset">Folders</md-subheader>

        <md-list-item>
          <md-avatar class="md-avatar-icon">
            <md-icon>folder</md-icon>
          </md-avatar>

          <div class="md-list-text-container">
            <span>Photos</span>
            <p>Jan 9, 2014</p>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon>info</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <md-avatar class="md-avatar-icon">
            <md-icon>folder</md-icon>
          </md-avatar>

          <div class="md-list-text-container">
            <span>Recipes</span>
            <p>Jan 17, 2014</p>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon>info</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <md-avatar class="md-avatar-icon">
            <md-icon>folder</md-icon>
          </md-avatar>

          <div class="md-list-text-container">
            <span>Work</span>
            <p>Jan 28, 2014</p>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon>info</md-icon>
          </md-button>

          <md-divider class="md-inset"></md-divider>
        </md-list-item>

        <md-subheader class="md-inset">Files</md-subheader>

        <md-list-item>
          <md-avatar class="md-avatar-icon md-primary">
            <md-icon>insert_drive_file</md-icon>
          </md-avatar>

          <div class="md-list-text-container">
            <span>Vacation Itinerary</span>
            <p>Jan 20, 2014</p>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon>info</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <md-avatar md-theme="orange" class="md-avatar-icon md-primary">
            <md-icon>collections</md-icon>
          </md-avatar>

          <div class="md-list-text-container">
            <span>Kitchen Remodel</span>
            <p>Jan 10, 2014</p>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon>info</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <md-avatar md-theme="green" class="md-avatar-icon md-primary">
            <md-icon>view_list</md-icon>
          </md-avatar>

          <div class="md-list-text-container">
            <span>Grocery Shop</span>
            <p>Jan 10, 2014</p>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon>info</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <md-avatar md-theme="orange" class="md-avatar-icon md-primary">
            <md-icon>collections</md-icon>
          </md-avatar>

          <div class="md-list-text-container">
            <span>Weekend Pictures</span>
            <p>Jan 10, 2014</p>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon>info</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </main>
  </div>
</template>

<style lang="scss" scoped>
html,
body,
.app-viewport {
  height: 100%;
  overflow: hidden;
}

.app-viewport {
  display: flex;
  flex-flow: column;
}

.main-toolbar {
  position: relative;
  z-index: 10;
}

.md-fab {
  margin: 0;
  position: absolute;
  bottom: -20px;
  left: 16px;
  z-index: 10;

  .md-icon {
    color: #fff;
  }
}

.md-title {
  padding-left: 8px;
  color: #fff;
}

.main-content {
  position: relative;
  z-index: 1;
  overflow: auto;
}

.md-list-action .md-icon {
  color: rgba(#000, .26);
}

.md-avatar-icon .md-icon {
  color: #fff !important;
}

.md-sidenav .md-list-text-container > :nth-child(2) {
  color: rgba(#fff, .54);
}

.md-account-header {
  .md-list-item:hover .md-button:hover {
    background-color: inherit;
  }

  .md-avatar-list .md-list-item-container:hover {
    background: none !important;
  }
}
</style>
