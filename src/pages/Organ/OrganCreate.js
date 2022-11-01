function OrganCreate() {
  return (
    <form class="ui form large">
      <div class="eight wide field">
        <label>Tên cơ quan</label>
        <input placeholder="First Name" />
      </div>
      <div class="eight wide field">
        <label>Địa chỉ</label>
        <input placeholder="Last Name" />
      </div>
      <button class="ui button" type="submit">
        Submit
      </button>
    </form>
  );
}

export default OrganCreate;
